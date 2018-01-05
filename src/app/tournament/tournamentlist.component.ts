// import { Component, OnInit } from '@angular/core';
// import { TournamentService, Tournament } from "app/tournament/tournament.service";

// @Component({
//     selector: 'tournamentlist',
//     templateUrl: 'tournamentlist.component.html'
// })

// export class TournamentListComponent implements OnInit {
//     public tournaments: Tournament[];
    
//     constructor(private TournamentService: TournamentService) { }

//     ngOnInit() {
//         this.TournamentService.getAll().subscribe(res => {
//             this.tournaments = res;
//         })
//     }
// }

import { Component, ViewChild } from "@angular/core";
import { TournamentService, Tournament } from "./tournament.service";
import { EditTournamentComponent } from "./edit-tournament.component";
import { ColumnDef, MyTableComponent } from "../configdata/mytable.component";
import { SnackBarComponent } from "../configdata/snackbar.component";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'tournamentlist',
    templateUrl: './tournamentlist.component.html',
})
export class TournamentListComponent {
    selectedTournament: Tournament;

    @ViewChild('tournaments') tournaments: MyTableComponent;
    @ViewChild('members') members: MyTableComponent;

    columnDefs: ColumnDef[] = [
        { name: 'name', type: 'String', header: 'Name', width: 1, key: true, filter: true, sort: 'asc' },
        { name: 'start', type: 'Date', header: 'Start Date', width: 1, filter: true, align: 'center' },
        { name: 'finish', type: 'Date', header: 'Finish Date', width: 1, filter: true, align: 'center' },
        { name: 'maxPlayers', type: 'Number', header: 'Max Players', width: 1, filter: true, align: 'center' }
    ];
    memberColumnDefs: ColumnDef[] = [
        { name: 'pseudo', type: 'String', header: 'Pseudo', width: 1, key: true, filter: true, sort: 'asc' },
        { name: 'profile', type: 'String', header: 'Profile', width: 2, filter: true },
        { name: 'birthdate', type: 'Date', header: 'Birth Date', width: 1, filter: true, align: 'center' },
        { name: 'admin', type: 'Boolean', header: 'Is Admin', width: 1, filter: false, align: 'center' }
    ];

    constructor(private tournamentService: TournamentService) {
    }

    get getDataService() {
        return m => this.tournamentService.getAll();
    }

    get addService() {
        return m => this.tournamentService.add(m);
    }

    get deleteService() {
        return m => this.tournamentService.delete(m);
    }

    get updateService() {
        return m => this.tournamentService.update(m);
    }

    public selectedItemChanged(item) {
        this.selectedTournament = this.tournaments.selectedItem as Tournament;
        // console.log("selectedTournament => " +this.selectedTournament.name)
        if (this.members)
            this.members.refresh();
    }

    get getMemberDataService() {
        return m => Observable.of(this.selectedTournament ? this.selectedTournament.members : null);
    }

    // get addAddressService() {
    //     return a => {
    //         // console.log("ADD", a, this.selectedMember);
    //         return this.memberService.addAddress(this.selectedMember, a);
    //     };
    // }

    // get deleteAddressService() {
    //     return a => {
    //         // console.log("DEL", a);
    //         return this.memberService.deleteAddress(this.selectedMember, a);
    //     };
    // }

    // get updateAddressService() {
    //     return a => {
    //         // console.log("UPD", a);
    //         return this.memberService.updateAddress(this.selectedMember, a);
    //     };
    // }
}