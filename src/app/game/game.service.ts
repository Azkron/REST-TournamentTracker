import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions } from "@angular/http";
import { SecuredHttp } from "../securedhttp.service";

import { Tournament} from "../tournament/tournament.service"

import { Tools } from "../configdata/tools";

import 'rxjs/add/operator/map';

export class Game {
    _id: string;
    player_1: string;
    player_2: string;
    score_player_1: number;
    score_player_2: number;
    points_player_1: number;
    points_player_2: number;
    openMatch: boolean;
    tournament: Tournament;

    constructor(data) {
        this._id = data._id;
        this.player_1 = data.player_1;
        this.player_2 = data.player_2;
        this.score_player_1 = data.score_player_1;
        this.score_player_2 = data.score_player_2;
        this.points_player_1 =  data.points_player_1;
        this.points_player_2 =  data.points_player_2;
        this.openMatch = data.openMatch;
        this.tournament = data.tournament;
    }
}

const URL = '/api/games/';

@Injectable()
export class GameService {
    constructor(private http: SecuredHttp) {
    }

    public getCountGame(): Observable<number> {
        return this.http.get(URL + 'countGame')
            .map(result => {
                return result.json();
            })
    }
    
    public getAll(): Observable<Game[]> {
        return this.http.get(URL)
            .map(result => {
                return result.json().map((json => new Game(json)));
            })
    }

    public getListResults(id:  String): Observable<Game[]> {
        return this.http.get(URL + 'listResults/' +id)
            .map(result => {
                return result.json().map(json => new Game(json));
            })
    }

    public add(g: Game): Observable<Game> {
        return this.http.post(URL, Tools.removeCircularReferences(g))
            .map(result => {
                let data = result.json();

                let returnValue = data ? new Game(data) : null
                console.log("gameService.addGame returnValue = ");
                console.log(returnValue);
                return returnValue;
            });
    }

    public updatePoints(pseudo: String, g : Game): Observable<boolean> {
        return this.http.put(URL + 'addPoint/' +pseudo, Tools.removeCircularReferences(g)).map(res => { console.log(res); return true;})
    }

    public updateAdmin(g: Game): Observable<boolean> {
        // console.log("gameservice => ")
        // console.log(g)
        return this.http.put(URL + '/updateAdmin', Tools.removeCircularReferences(g)).map(res => {console.log(res); return true;});
    }

    public updateCurrent(g: Game): Observable<boolean> {
        // console.log("gameservice => ")
        // console.log(g)
        return this.http.put(URL + '/updateCurrent', Tools.removeCircularReferences(g)).map(res => {console.log(res); return true;});
    }

    public delete(g: Game): Observable<boolean> {
        return this.http.delete(URL + g._id).map(res => true);
    }
    
    // res => new Game(res.json())
    // public getOneDetails(name: string): Observable<Tournament> {
    //     // return this.http.get(URL +name)
    //     //     .map(result => {
    //     //         let data = result.json();
    //     //         return data.length > 0 ? new Tournament(data[0]) : null;
    // // });
    //     return this.getAll().map(tournaments => 
    //         tournaments.find(t => t.name === name))
    // }

    // public getOne(name: string): Observable<Tournament> {
    //     return this.http.get(URL +name)
    //         .map(result => {
    //             let data = result.json();
    //             return data.length > 0 ? new Tournament(data[0]) : null;
    //         });
    // }

    // public update(t: Tournament): Observable<boolean> {
    //     console.log(t);
    //     return this.http.put(URL + t.name, Tools.removeCircularReferences(t)).map(res => true);
    // }

    // public delete(t: Tournament): Observable<boolean> {
    //     return this.http.delete(URL + t.name).map(res => true);
    // }
}
