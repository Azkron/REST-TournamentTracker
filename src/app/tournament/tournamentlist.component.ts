import { Component, OnInit } from '@angular/core';
import { TournamentService, Tournament } from "app/tournament/tournament.service";

@Component({
    selector: 'tournamentlist',
    templateUrl: 'tournamentlist.component.html'
})

export class TournamentListComponent implements OnInit {
    public tournaments: Tournament[];
    
    constructor(private TournamentService: TournamentService) { }

    ngOnInit() {
        this.TournamentService.getAll().subscribe(res => {
            this.tournaments = res;
        })
    }
}

// import { Component, ViewChild } from "@angular/core";
// import { TournamentService, Tournament } from "./tournament.service";
// import { EditTournamentComponent } from "./edit-tournament.component";
// import { ColumnDef } from "../mytable.component";
// import { SnackBarComponent } from "../snackbar.component";

// @Component({
//     selector: 'tournamentlist',
//     templateUrl: './tournamentlist.component.html',
// })
// export class TournamentListComponent {
//     columnDefs: ColumnDef[] = [
//         { name: 'name', type: 'String', header: 'Name', width: 1, key: true, filter: true, sort: 'asc' },
//         { name: 'start', type: 'Date', header: 'Start Date', width: 1, filter: true, align: 'center' },
//         { name: 'finish', type: 'Date', header: 'Finish Date', width: 1, filter: true, align: 'center' },
//         { name: 'maxPlayers', type: 'Number', header: 'Max Players', width: 1, filter: true, align: 'center' }
//     ];

//     constructor(private tournamentService: TournamentService) {
//     }

//     get getDataService() {
//         return m => this.tournamentService.getAll();
//     }

//     get addService() {
//         return m => this.tournamentService.add(m);
//     }

//     get deleteService() {
//         return m => this.tournamentService.delete(m);
//     }

//     get updateService() {
//         return m => this.tournamentService.update(m);
//     }
// }