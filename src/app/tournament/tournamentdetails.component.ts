import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TournamentService, Tournament } from "app/tournament/tournament.service";
import { MemberService, Member } from "../member/member.service";
import { ColumnDef, MyTableComponent } from "../configdata/mytable.component";

import { SnackBarComponent } from "../configdata/snackbar.component";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/switchMap';

  @Component({
    selector: 'tournamentdetails',
    templateUrl: 'tournamentdetails.component.html'
})

export class TournamentDetailsComponent implements OnInit {
    public tournamentDetails: Tournament;
    public memberUnassignedCount: number | '?' = '?';
    public memberAssignedCount: number | '?' = '?';

    selectedMember: Member;

    @ViewChild('membersUnassigned') membersUnassigned: MyTableComponent;
    @ViewChild('membersAssigned') membersAssigned: MyTableComponent;
    
        columnDefs: ColumnDef[] = [
            { name: 'pseudo', type: 'String', header: 'Pseudo', width: 1, key: true, filter: true, sort: 'asc' },
            { name: 'profile', type: 'String', header: 'Profile', width: 1, filter: true },
            { name: 'birthdate', type: 'Date', header: 'Birth Date', width: 1, filter: true, align: 'center' },
        ];
        columnDefsAssigned: ColumnDef[] = [
            { name: 'pseudo', type: 'String', header: 'Pseudo', width: 1, key: true, filter: true, sort: 'asc' },
            { name: 'profile', type: 'String', header: 'Profile', width: 1, filter: true },
            { name: 'birthdate', type: 'Date', header: 'Birth Date', width: 1, filter: true, align: 'center' },
        ];
    
    constructor(
		private route: ActivatedRoute,
        private router: Router,
        private TournamentService: TournamentService,
        private MemberService: MemberService) { 
            
        }

        // get getDataService() {
        //     return m => this.MemberService.getAll();
        // }

    ngOnInit() {
        this.route.params
            .switchMap((params: ParamMap) => this.TournamentService.getOneDetails(params['name']))
            .subscribe((t : Tournament) => this.tournamentDetails = t);
        this.TournamentService.getCountMembersUnassigned().subscribe(c => this.memberUnassignedCount = c);
        this.TournamentService.getCountMembersAssigned().subscribe(c => this.memberAssignedCount = c);
    }

    // get getUnassignedDataService() {
        
    // }
    

    get getAssignedDataService() {
        return m => Observable.of(this.tournamentDetails ? this.tournamentDetails.member : null);
    }
}
