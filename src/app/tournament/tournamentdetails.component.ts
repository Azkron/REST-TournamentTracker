import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TournamentService, Tournament } from "app/tournament/tournament.service";
import { MemberService, Member } from "../member/member.service";
import { ColumnDef, CustomTableComponent } from "../configtable/customtable.component";
import { SnackBarComponent } from "app/snackbar.component";
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

    @ViewChild('membersUnassigned') membersUnassigned: CustomTableComponent;
    @ViewChild('membersAssigned') membersAssigned: CustomTableComponent;
    
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
            this.TournamentService.getCountMembersUnassigned().subscribe(c => this.memberUnassignedCount = c);
            this.TournamentService.getCountMembersAssigned().subscribe(c => this.memberAssignedCount = c);
        }

        // get getDataService() {
        //     return m => this.MemberService.getAll();
        // }

    ngOnInit() {
        this.route.params
            .switchMap((params: ParamMap) => this.TournamentService.getOneDetails(params['name']))
            .subscribe((t : Tournament) => this.tournamentDetails = t);
    }

    // get getUnassignedDataService() {
    //     return m => this.TournamentService.getAll();
    // }

    // get getAssignedDataService() {
    //     return m => this.TournamentService.getAll();
    // }
}
