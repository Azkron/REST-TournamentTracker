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

    ngOnInit() {
        this.getInfoTournament();  
    }

    public getInfoTournament() {
        this.route.params
        .switchMap((params: ParamMap) => this.TournamentService.getOneDetails(params['name']))
        .subscribe((t : Tournament) => { 
            console.log(t._id)
            // console.log("tournament details => " +this.MemberService.getCountMembersUnassigned(t._id).subscribe(c => this.memberUnassignedCount = c));
            this.tournamentDetails = t;   
            this.getCountMembers();
         });        
    }

    public getCountMembers() {
        this.MemberService.getCountMembersUnassigned(this.tournamentDetails._id).subscribe(c => this.memberUnassignedCount = c);
        this.MemberService.getCountMembersAssigned(this.tournamentDetails._id).subscribe(c => this.memberAssignedCount = c);    
    }

    public selectedItemChangedUnassigned(item) {
        this.selectedMember = this.membersUnassigned.selectedItem as Member;
        console.log("selected Member Unassigned => " + this.selectedMember)
        // if (this.membersUnassigned)
        //     this.membersUnassigned.refresh();
    }


    public selectedItemChangedAssigned(item) {
        this.selectedMember = this.membersAssigned.selectedItem as Member;
        console.log("selected Member Assigned=> " +this.selectedMember)
        // if (this.membersAssigned)
        //     this.membersAssigned.refresh();
    }


    get getUnassignedDataService() {
        return m => this.MemberService.getUnassignedDataService(this.tournamentDetails._id);
    }
    

    get getAssignedDataService() {
        return m => Observable.of(this.tournamentDetails ? this.tournamentDetails.member : null);
    }

    sendUnassigned() {
        this.selectedMember = this.membersUnassigned.selectedItem as Member;
        if(this.selectedMember) {
                console.log("selected Member Unassigned click => " + this.selectedMember.pseudo);
                console.log("tounrament details name => " +this.tournamentDetails.name);
                return this.MemberService.addMemberTournament(this.tournamentDetails, this.selectedMember);            
        }
    }

    sendAssigned() {
        this.selectedMember = this.membersAssigned.selectedItem as Member;
        if(this.selectedMember) {
            console.log("selected Member Unassigned click => " + this.selectedMember.pseudo);
            console.log("tounrament details name => " +this.tournamentDetails.name)

            // this.MemberService.addMemberTournament(this.tournamentDetails, this.selectedMember)
        }

    }

    sendAllUnassigned() {

    }

    sendAllAssigned() {

    }
}
