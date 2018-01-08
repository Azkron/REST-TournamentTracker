import { Component, OnInit, Inject, ElementRef, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { GameService, Game } from "./game.service";
import { IDialog, DialogResult } from "../configdata//dialog";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { MyInputComponent } from "../configdata/myinput.component";
import { MyModalComponent } from "../configdata/mymodal.component";
import { validateConfig } from '@angular/router/src/config';
import { ColumnDef, MyTableComponent } from "../configdata/mytable.component";
import { AuthService } from "../auth.service"
import * as _ from 'lodash';

declare var $: any;

@Component({
    selector: 'edit-game',
    templateUrl: 'edit-game.component.html'
})
export class EditGameComponent implements OnInit, IDialog {
    public frm: FormGroup;
    public ctlPlayer_1: FormControl;
    public ctlScore_Player_1: FormControl;
    public ctlPlayer_2: FormControl;
    public ctlScore_Player_2: FormControl;
    public closed: Subject<DialogResult>;
    private g: Game;

    @ViewChild(MyModalComponent) modal: MyModalComponent;
    @ViewChild('game') game: MyInputComponent;

    constructor(private gameService: GameService, private fb: FormBuilder, private authService : AuthService) {
        this.ctlPlayer_1 = this.fb.control('', [Validators.required, Validators.minLength(3), this.forbiddenValue('abc')]);
        this.ctlScore_Player_1 = this.fb.control('', [Validators.required]);
        this.ctlPlayer_2 = this.fb.control('', []);
        this.ctlScore_Player_2 = this.fb.control('', []);
        this.frm = this.fb.group({
            _id: null,
            player_1: this.ctlPlayer_1,
            score_player_1: this.ctlScore_Player_1,
            player_2: this.ctlPlayer_2,
            score_player_2: this.ctlScore_Player_2
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

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre
    // pseudoUsed(): any {
    //     let timeout;
    //     return (ctl: FormControl) => {
    //         clearTimeout(timeout);
    //         let pseudo = ctl.value;
    //         return new Promise(resolve => {
    //             timeout = setTimeout(() => {
    //                 if (ctl.pristine)
    //                     resolve(null);
    //                 else
    //                     this.memberService.getOne(pseudo).subscribe(member => {
    //                         resolve(member ? { pseudoUsed: true } : null);
    //                     });
    //             }, 300);
    //         });
    //     };
    // }

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

    crossValidations(group: FormGroup) {
        if (group.pristine || !group.value) return;
        EditGameComponent.assert(
            group,
            ['player_1', 'player_2'],
            group.value.player_1 != group.value.player_2,
            { playerNotConfirmed: true }
        );
    }

    ngOnInit() {
        this.modal.shown.subscribe(_ => this.game.setFocus(true));
    }

    show(g: Game): Subject<DialogResult> {
        this.g = g;
        // this.address.refresh();
        this.closed = new Subject<DialogResult>();
        this.frm.reset();
        this.frm.markAsPristine();
        this.frm.patchValue(g);
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
