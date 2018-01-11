import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TournamentService, Tournament } from "app/tournament/tournament.service";
import { MemberService, Member } from "../member/member.service";
import { GameService, Game } from "../game/game.service";

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
    public listMembersUnassigned : Member[];
    public listGame : Game[];
    public sendUnassignedActive :boolean;
    public sendAssignedActive :boolean;
    // public listGame =  new Array<Game>();

    selectedMember: Member;

    @ViewChild('membersUnassigned') membersUnassigned: MyTableComponent;
    @ViewChild('membersAssigned') membersAssigned: MyTableComponent;
    @ViewChild('snackbar') snackbar: SnackBarComponent;
    
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
        private MemberService: MemberService,
        private GameService: GameService) { 
        }

    ngOnInit() {
        this.sendUnassignedActive = false;
        this.sendAssignedActive = false;
        this.getInfoTournament();  
    }

    public getInfoTournament() {
        this.route.params
        .switchMap((params: ParamMap) => this.TournamentService.getOneDetails(params['name']))
        .subscribe((t : Tournament) => { 
            console.log(t._id)
            // console.log("tournament details => " +this.MemberService.getCountMembersUnassigned(t._id).subscribe(c => this.memberUnassignedCount = c));
            this.MemberService.getUnassignedDataService(t._id).subscribe(l => {
                this.listMembersUnassigned = l
                this.tournamentDetails = t;   
                this.getCountMembers();
            });
         });        
    }

    public getCountMembers() {
        this.memberUnassignedCount = this.listMembersUnassigned ? this.listMembersUnassigned.length : 0;
        this.memberAssignedCount = this.tournamentDetails.members ? this.tournamentDetails.members.length : 0;
        // this.MemberService.getCountMembersUnassigned(this.tournamentDetails._id).subscribe(c => this.memberUnassignedCount = c);
        // this.MemberService.getCountMembersAssigned(this.tournamentDetails._id).subscribe(c => this.memberAssignedCount = c);    
    }

    public selectedItemChangedUnassigned(item) {
        this.sendUnassignedActive = true;
        this.sendAssignedActive = false;
        this.selectedMember = this.membersUnassigned.selectedItem as Member;
        // console.log("selected Member Unassigned => " + this.selectedMember.pseudo)
        // if (this.membersUnassigned)
        //     this.membersUnassigned.refresh();
    }

    public selectedItemChangedAssigned(item) {
        this.sendUnassignedActive = false;
        this.sendAssignedActive = true;
        this.selectedMember = this.membersAssigned.selectedItem as Member;
        // console.log("selected Member Assigned=> " +this.selectedMember.pseudo)
        // if (this.membersAssigned)
        //     this.membersAssigned.refresh();
    }

    get getUnassignedDataService() {
        // console.log("list members => " +this.listMembersUnassigned.find(x => x.pseudo == "admin").pseudo);
        return m => Observable.of(this.listMembersUnassigned ? this.listMembersUnassigned : null);
    }

    get getAssignedDataService() {
        return m => Observable.of(this.tournamentDetails ? this.tournamentDetails.members : null);
    }

    sendUnassigned() {
        this.selectedMember = this.membersUnassigned.selectedItem as Member;
        if(this.selectedMember) {
                // console.log("selected Member Unassigned click => " + this.selectedMember.pseudo);
                // console.log("tounrament details name => " +this.tournamentDetails.name);

                this.tournamentDetails.members.push(this.selectedMember);
                this.selectedMember.tournaments.push(this.tournamentDetails);

                this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("update tournament => " +t ));
                this.MemberService.update(this.selectedMember).subscribe(m => console.log("update member => " +m ));

                let index = this.listMembersUnassigned.findIndex(m => m.pseudo == this.selectedMember.pseudo);
                this.listMembersUnassigned.splice(index, 1)
                this.membersUnassigned.refresh();
                this.membersAssigned.refresh();

                this.getCountMembers();
                // this.MemberService.addMemberTournament(this.tournamentDetails, this.selectedMember)
                //     .subscribe(t => this.tournamentDetails = t);     
        }
        // this.selectedMember = null;
    }

    sendAllUnassigned() {
        
        this.sendUnassignedActive = false;
        this.sendAssignedActive = false;
        for(let i of this.listMembersUnassigned) {
            // console.log("i unassigned => " +i)
            let m = new Member(i);

            // if(this.tournamentDetails == null) {
            //     this.route.params
            //     .switchMap((params: ParamMap) => this.TournamentService.getOneDetails(params['name']))
            //     .subscribe((t : Tournament) => { 
            //         console.log(t._id);
            //         this.tournamentDetails = t;   
            //     })
            // }

            this.tournamentDetails.members.push(m);
            m.tournaments.push(this.tournamentDetails);

            this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("update all tournament => " +t ));
            this.MemberService.update(m).subscribe(m => console.log("update all member => " +m ));
        }
        // this.tournamentDetails.members.push(this.selectedMember);
        // this.selectedMember.tournaments.push(this.tournamentDetails);

        // this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("update tournament => " +t ));
        // this.MemberService.update(this.selectedMember).subscribe(m => console.log("update member => " +m ));
        this.listMembersUnassigned = [];
    
        this.membersUnassigned.refresh();
        this.membersAssigned.refresh();

        this.getCountMembers();
    }

    sendAssigned() {
        this.selectedMember = this.membersAssigned.selectedItem as Member;
        if(this.selectedMember) {
            // console.log("selected Member Assigned click => " + this.selectedMember.pseudo);
            // console.log("tounrament details name => " +this.tournamentDetails.name)

            let indexMember = this.tournamentDetails.members.findIndex(m => m._id == this.selectedMember._id);
            let indexTournament = this.selectedMember.tournaments.findIndex(t => t._id == this.tournamentDetails._id)
            
            // if(this.listMembersUnassigned == null)
            //     this.listMembersUnassigned = new Array<Member>();

            this.listMembersUnassigned.push(this.selectedMember)

            this.tournamentDetails.members.splice(indexMember, 1);
            this.selectedMember.tournaments.splice(indexTournament, 1);

            this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("delete tournament => " +t ));
            this.MemberService.update(this.selectedMember).subscribe(m => console.log("delete member => " +m ));
   
            this.membersUnassigned.refresh();
            this.membersAssigned.refresh();

            this.getCountMembers();
        }
        // this.selectedMember = null;
    }

    sendAllAssigned() {
        
        this.sendUnassignedActive = false;
        this.sendAssignedActive = false;
        for(let i of this.tournamentDetails.members) {
            // console.log("i.pseudo=> " + i.pseudo);
            // console.log("i.tournaments=> " + i.tournaments);

            let m = new Member(i);

            let indexMember = this.tournamentDetails.members.findIndex(x => x._id == m._id);
            let indexTournament = m.tournaments.findIndex(t => t.toString() == this.tournamentDetails._id)
            
            // console.log("index member => " +indexMember);
            // console.log("index tournament => " +indexTournament);

            // if(this.listMembersUnassigned == null)
            //     this.listMembersUnassigned = new Array<Member>();

            this.listMembersUnassigned.push(m);

            // this.tournamentDetails.members.splice(indexMember, 1);
            m.tournaments.splice(indexTournament, 1);
            
            this.MemberService.update(m).subscribe(x => console.log("delete all tournament in assigned member => " +x ));
        }
        // this.tournamentDetails.members.push(this.selectedMember);
        // this.selectedMember.tournaments.push(this.tournamentDetails);

        // this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("update tournament => " +t ));
        // this.MemberService.update(this.selectedMember).subscribe(m => console.log("update member => " +m ));
        this.tournamentDetails.members = [];
        this.TournamentService.update(this.tournamentDetails).subscribe(t => console.log("delete all members in tournament => " +t ));
        
        this.membersUnassigned.refresh();
        this.membersAssigned.refresh();

        this.getCountMembers();
    }

    Save() { 

        this.TournamentService.updateSubscriptions(this.tournamentDetails).subscribe(t => {
            console.log("CloseInscriptions tournament = ");
            console.log(t);
        });
        setTimeout(() => {
            this.router.navigate(['/tournaments']);
        }, 2000);
    } 

    CloseInscriptions() { 
        this.tournamentDetails.closed = true;
        this.Save();
    }    
}
