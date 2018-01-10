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
import { IDialog, DialogResult } from "../configdata/dialog";

@Component({
    selector: 'tournamentlist',
    templateUrl: './tournamentlist.component.html',
})
export class TournamentListComponent {
    public listGame : Game[];
    public listResults: Game[];
    public selectedTournament: Tournament;
    public selectedGame: Game;

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
        { name: 'points_player_1', type: 'Number', header: 'Points Player 1', width: 1, filter: true, align: 'center'},
        { name: 'score_player_1', type: 'Number', header: 'Score Player 1', width: 1, filter: true, align: 'center' },
        { name: 'score_player_2', type: 'Number', header: 'Score Player 2', width: 1, filter: true, align: 'center' },
        { name: 'points_player_2', type: 'Number', header: 'Points Player 2', width: 1, filter: true, align: 'center'},
        { name: 'player_2', type: 'String', header: 'Player_2', width: 1, filter: true, sort: 'asc' }
    ];

    constructor(private tournamentService: TournamentService, private authService: AuthService, private gameService: GameService) {
    }

    public subscribe(tournament : Tournament){

        // let updatedTournament: Tournament = null;

        this.tournamentService.subscribeCurrent(tournament).subscribe(t => {
            console.log("subscribe result = ");
            console.log(t);
            tournament = t;
        });
 
    }

    public getResultsTournament(id: String) {
        this.gameService.getListResults(id).subscribe(res => {
            this.listResults = res;
        })
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
        if(this.selectedTournament) {
            console.log(this.selectedTournament.members)
            this.getResultsTournament(this.selectedTournament._id)
            // console.log("selectedTournament => " +this.selectedTournament.name)
            if (this.games) {
                this.games.refresh();
                console.log("eeeee")
            }
        }
        this.listResults = [];
        
    }

    // openEditModal(editModal : IDialog)
    // {
    //     editModal.show(this.currentMember).subscribe( dialogResult=>{
    //         console.log(dialogResult);
    //         if(dialogResult.action = "update")
    //         {
    //             let updatedMember = dialogResult.data as Member;
    //             console.log("Updated Member: " + updatedMember);
    //             this.currentMember.profile = updatedMember.profile;
    //             this.currentMember.password = updatedMember.password;
    //             this.currentMember.birthdate = updatedMember.birthdate;
    //             this.memberService.updateCurrent(Tools.removeCircularReferences(this.currentMember)).subscribe(result => {
    //                 console.log("updateCurrent result : " + result);
    //             }, err => {
    //                 console.log(err)
    //             });;
    //         }

    //     });
    // }

    public selectedItemChangedGame(editModal : IDialog) {
        this.selectedGame = this.games.selectedItem as Game;
        // console.log("selected Game => " + this.selectedGame.player_1)
        // console.log("current user => " +this.authService.currentUser)
        if (this.games && (this.selectedGame.player_1 == this.authService.currentUser || this.selectedGame.player_2 == this.authService.currentUser )) {
            editModal.show(this.selectedGame).subscribe(dialogResult => {
                console.log(dialogResult);
                if(dialogResult.action == "update") {
                    let updatedGame = dialogResult.data as Game;
                    console.log("Updated Game => ");
                    console.log(updatedGame);

                    // if(this.authService.currentUser == this.selectedGame.player_1) {
                    //     updatedGame.points_player_2 = this.selectedGame.points_player_2;
                    // }
                    // else if (this.authService.currentUser == this.selectedGame.player_2) {
                    //     updatedGame.points_player_1 = this.selectedGame.points_player_1
                    // }
                    console.log("selected game => ")
                    console.log(this.selectedGame)
                    this.gameService.updateAdmin(updatedGame).subscribe(result => {
                        console.log("updateAdmin result => " +result)
                    })
                }
            })
        }
    }

    get getGameDataService() {
        // console.log("games =>  " +this.gameService.getAll())
        // console.log("tournament => " +this.selectedTournament.name)
        // console.log("games => " +this.selectedTournament.games)
        return m => Observable.of(this.selectedTournament ? this.selectedTournament.games : null);
        // return m => this.gameService.getAll();
    }
}