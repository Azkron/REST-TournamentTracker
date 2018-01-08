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
import { EditGameComponent } from "../game/edit-game.component";
import { GameService, Game } from "../game/game.service";
import { ColumnDef, MyTableComponent } from "../configdata/mytable.component";
import { SnackBarComponent } from "../configdata/snackbar.component";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../auth.service";

@Component({
    selector: 'tournamentlist',
    templateUrl: './tournamentlist.component.html',
})
export class TournamentListComponent {
    public listGame : Game[];
    selectedTournament: Tournament;

    @ViewChild('tournaments') tournaments: MyTableComponent;
    @ViewChild('games') games: MyTableComponent;

    columnDefs: ColumnDef[] = [
        { name: 'name', type: 'String', header: 'Name', width: 1, key: true, filter: true, sort: 'asc' },
        { name: 'start', type: 'Date', header: 'Start Date', width: 1, filter: true, align: 'center' },
        { name: 'finish', type: 'Date', header: 'Finish Date', width: 1, filter: true, align: 'center' },
        { name: 'maxPlayers', type: 'Number', header: 'Max Players', width: 1, filter: true, align: 'center' }
    ];
    gameColumnDefs: ColumnDef[] = [
        { name: 'player_1', type: 'String', header: 'Player_1', width: 1, key: true, filter: true, sort: 'asc' }, 
        { name: 'points_player_1', type: 'String', header: 'Points Player 1', width: 1, filter: true, align: 'center'},
        { name: 'score_player_1', type: 'String', header: 'Score Player 1', width: 1, filter: true, align: 'center' },
        { name: 'score_player_2', type: 'String', header: 'Score Player 2', width: 1, filter: true, align: 'center' },
        { name: 'points_player_2', type: 'String', header: 'Points Player 2', width: 1, filter: true, align: 'center'},
        { name: 'player_2', type: 'String', header: 'Player_2', width: 1, filter: true, sort: 'asc' }
    ];

    constructor(private tournamentService: TournamentService, private authService: AuthService) {
    }

    public subscribe(tournament : Tournament){
        this.tournamentService.subscribeCurrent(tournament);
    }

    public getGamesTournament() {

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
        if (this.games)
            this.games.refresh();
    }

    get getGameDataService() {
        // console.log("games =>  " +this.gameService.getAll())
        console.log("tournament => " +this.selectedTournament.name)
        console.log("games => " +this.selectedTournament.games)
        return m => Observable.of(this.selectedTournament ? this.selectedTournament.games : null);
        // return m => this.gameService.getAll();
    }
}