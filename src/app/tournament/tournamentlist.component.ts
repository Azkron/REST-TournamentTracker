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
    public listResults = new Array<Game>();
    public selectedTournament: Tournament;
    public selectedGame: Game;
    public subscribeActive : boolean = true;

    @ViewChild('tournaments') tournaments: MyTableComponent;
    @ViewChild('games') games: MyTableComponent;
    @ViewChild('snackbar') snackbar: SnackBarComponent;

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
        this.subscribeActive = false;
        this.tournamentService.subscribeCurrent(tournament).subscribe(t => {
            console.log("subscribe result = ");
            console.log(t);
            this.tournaments.refresh();
            this.games.refresh();
        });

 
    }

    public getResultsTournament() {
        this.listResults = [];

        for(let i of this.selectedTournament.members) {
            let z = 0;
            let g : Game;
            for (let j of this.selectedTournament.games) {
                if(z == 0) {
                    g = new Game({
                        player_1 : i.pseudo,
                        points_player_1 : 0
                    })
                    ++z;
                }
                if(i.pseudo == j.player_1) {
                    g.points_player_1 +=  j.points_player_1;
                }
                else if(i.pseudo == j.player_2) {
                    g.points_player_1 += j.points_player_2;
                }

            }
            this.listResults.push(g);
        }
    }

    get getDataService() {
        return t => this.tournamentService.getAll();
    }

    get addService() {
        return t => this.tournamentService.add(t);
    }

    get deleteService() {
        return t => this.tournamentService.delete(t);
    }

    get updateService() {
        return t => this.tournamentService.update(t);
    }

    public selectedItemChanged(item) {
        this.subscribeActive = true;
        this.selectedTournament = this.tournaments.selectedItem as Tournament;
        if(this.selectedTournament) {
            for(let member of this.selectedTournament.members)
                if(this.authService.currentUser == member.pseudo)
                    this.subscribeActive = false;
            // console.log("selectedTournament => " +this.selectedTournament.name)
            this.getResultsTournament();
            if (this.games)
                this.games.refresh();
        }

    }

    public selectedItemChangedGame(editModal : IDialog) {
        if(!this.selectedTournament.closed)
        {
            this.snackbar.alert("The tournament subscriptions must be closed by an admin before you can edit scores");
        }
        else
        {
            this.selectedGame = this.games.selectedItem as Game;
            // console.log("selected Game => " + this.selectedGame.player_1)
            // console.log("current user => " +this.authService.currentUser)
            if(this.selectedGame.openMatch == null)
                this.selectedGame.openMatch = true;
            if(this.selectedGame.openMatch) {
                if (this.games && (this.selectedGame.player_1 == this.authService.currentUser || this.selectedGame.player_2 == this.authService.currentUser )) {
                    editModal.show(this.selectedGame).subscribe(dialogResult => {
                        console.log(dialogResult);
                        if(dialogResult.action == "update") {
                            let test : number = 2;
                            test = test - 1/2;
                            console.log("test => " +test)
                            let updatedGame = dialogResult.data as Game;
        
                            console.log("Updated Game => ");
                            console.log(updatedGame);
        
                            // console.log("before points operation =>")
                            // console.log(updatedGame.points_player_1)
                            // console.log(updatedGame.points_player_2)   
        
                            if(updatedGame.points_player_1 == null)
                                updatedGame.points_player_1 = 0;
                            if(updatedGame.points_player_2 == null)
                                updatedGame.points_player_2 = 0;
        
                            
                            // console.log("after points operation =>")
                            // console.log(updatedGame.points_player_1)
                            // console.log(updatedGame.points_player_2)
        
        
        
                            if(updatedGame.score_player_1 !== -1 && updatedGame.score_player_2 !== -1) {
        
                                if(updatedGame.score_player_1 > updatedGame.score_player_2) {
                                    // console.log("before points operation =>")
        
                                    // updatedGame.points_player_1 = 0;
                                    // console.log(updatedGame.points_player_1)
                                    // console.log("after points operation =>")
                                    // console.log(updatedGame.points_player_1 + 1)
                                    updatedGame.points_player_1 = updatedGame.points_player_1 + 1;
                                }
                                else if(updatedGame.score_player_1 == updatedGame.score_player_2) {
                                    updatedGame.points_player_1 = updatedGame.points_player_1 + 1/2;
                                    updatedGame.points_player_2 = updatedGame.points_player_2 + 1/2;
                                }
                                else if(updatedGame.score_player_1 < updatedGame.score_player_2) {
                                    updatedGame.points_player_2 = +updatedGame.points_player_2 + 1;
                                }
                                updatedGame.openMatch = false;
                                    
        
                                console.log("after update of points")
                                console.log(updatedGame)
                                    
                            }
                                
        
                            // if(this.authService.currentUser == this.selectedGame.player_1) {
                            //     updatedGame.points_player_2 = this.selectedGame.points_player_2;
                            // }
                            // else if (this.authService.currentUser == this.selectedGame.player_2) {
                            //     updatedGame.points_player_1 = this.selectedGame.points_player_1
                            // }
                            console.log("selected game => ")
                            console.log(this.selectedGame)
                            if(this.authService.isAdmin) {
                                this.gameService.updateAdmin(updatedGame).subscribe(result => {
                                    console.log("updateAdmin result => " +result)
                                })
                            }
                            else {
                                this.gameService.updateCurrent(updatedGame).subscribe(result => {
                                    console.log("updateCurrent result => " +result)
                                })
                            }
                            this.selectedTournament = null;
                            this.games.refresh();
                            this.tournaments.refresh();
                        }
                    })
                }
            }
            else  {
                this.snackbar.alert("The match is closed since both players have a score");
            }
            
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