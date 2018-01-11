import { Component, OnInit, Inject, ElementRef, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { TournamentService, Tournament } from "./tournament.service";
import { IDialog, DialogResult } from "../configdata/dialog";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { MyInputComponent } from "../configdata/myinput.component";
import { MyModalComponent } from "../configdata/mymodal.component";
import { validateConfig } from '@angular/router/src/config';

declare var $: any;

@Component({
    selector: 'edit-tournament',
    templateUrl: 'edit-tournament.component.html'
})
export class EditTournamentComponent implements OnInit, IDialog {
    public frm: FormGroup;
    public ctlName: FormControl;
    public ctlStart: FormControl;
    public ctlFinish: FormControl;
    public ctlMaxPlayers: FormControl;
    public closed: Subject<DialogResult>;

    @ViewChild(MyModalComponent) modal: MyModalComponent;
    @ViewChild('name') name: MyInputComponent;

    constructor(private tournamentService: TournamentService, private fb: FormBuilder) {
        this.ctlName = this.fb.control('', [Validators.required, Validators.minLength(1)], [this.nameTournamentUsed()]);
        this.ctlStart = this.fb.control('', [Validators.required]);
        this.ctlFinish = this.fb.control('', []);
        this.ctlMaxPlayers = this.fb.control('', []);
        this.frm = this.fb.group({
            _id: null,
            name: this.ctlName,
            start: this.ctlStart,
            finish: this.ctlFinish,
            maxPlayers: this.ctlMaxPlayers,
        }, { validator: this.crossValidations });
    }

    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val)
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } }
            return null;
        };
    }

    // Validateur asynchrone qui vérifie si le nom du tournoi n'est pas déjà utilisé par un autre tournoi
    nameTournamentUsed(): any {
        let timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            let name = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine)
                        resolve(null);
                    else
                        this.tournamentService.getOne(name).subscribe(tournament => {
                            resolve(tournament ? { tournamentUsed: true } : null);
                        });
                }, 300);
            });
        };
    }

    static assert(group: FormGroup, ctlName: string[], value: boolean, error: object) {
        ctlName.forEach(n => {
            if (group.contains(n)) {
                if (!value) {
                    group.get(n).setErrors(error);
                    group.get(n).markAsDirty();
                }
                else {
                    group.get(n).setErrors(null);
                }
            }
        });
    }
    forbiddenValueDate(val: Date): any {
        let start : Date = new Date(this.frm.value.start);
        let valueFinish =  val.getTime();
        let valueStart = start.getTime();
        return (ctl: FormControl) => {
            if (valueFinish < valueStart)
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } }
            return null;
        };
    }

    crossValidations(group: FormGroup) {
        if (group.pristine || !group.value) return;
        if(this.frm.value.start !== null) {
            console.log("frm value => ")
        console.log(this.frm.value.start)
        let startD = new Date(this.frm.value.start); 
        let finishD = new Date(this.frm.value.finish);
        let valueFinish =  startD.getTime();
        let valueStart = finishD.getTime();
        EditTournamentComponent.assert(
            group,
            ['start', 'finish'],
            valueFinish < valueStart,
            { finishDateInferior: true }
        );

        }
        
    }

    ngOnInit() {
        this.modal.shown.subscribe(_ => this.name.setFocus(true));
    }

    show(m: Tournament): Subject<DialogResult> {
        this.closed = new Subject<DialogResult>();
        this.frm.reset();
        this.frm.markAsPristine();
        this.frm.patchValue(m);
        this.modal.show();
        return this.closed;
    }

    update() {
        this.modal.close();
        this.closed.next({ action: 'update', data: this.frm.value });
    }

    cancel() {
        this.modal.close();
        this.closed.next({ action: 'cancel', data: this.frm.value });
    }

    ouvrir() {
        console.log("ouvert");
    }

    fermer() {
        console.log("fermé");
    }
}
