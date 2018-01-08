import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions } from "@angular/http";
import { SecuredHttp } from "../securedhttp.service";
import { Member} from "../member/member.service"
import { Game } from "../game/game.service"
import { Tools } from "../configdata/tools";

import 'rxjs/add/operator/map';

export class Tournament {
    _id: string;
    name: string;
    start: string;
    finish: string;
    maxPlayers: Number;
    members: Member[];
    games: Game[];

    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.start = data.start && data.start.length > 10 ? data.start.substring(0, 10) : data.start;
        this.finish = data.finish && data.finish.length > 10 ? data.finish.substring(0, 10) : data.finish;
        this.maxPlayers = data.maxPlayers;
        this.members = data.members;
        this.games = data.games;
    }
}

const URL = '/api/tournaments/';

@Injectable()
export class TournamentService {
    constructor(private http: SecuredHttp) {
    }

    public subscribeCurrent(tournament: Tournament): Observable<number>{
        return this.http.put(URL + 'subscribeCurrent',{"tournament": Tools.removeCircularReferences(tournament)})
            .map(result => {
                return result.json();
            })
    }

    public getCountTournament(): Observable<number> {
        return this.http.get(URL + 'countTournament')
            .map(result => {
                return result.json();
            })
    }
    
    public getAll(): Observable<Tournament[]> {
        return this.http.get(URL)
            .map(result => {
                return result.json().map((json => new Tournament(json)));
            })
    }

    public getOneDetails(name: string): Observable<Tournament> {
        // return this.http.get(URL +name)
        //     .map(result => {
        //         let data = result.json();
        //         return data.length > 0 ? new Tournament(data[0]) : null;
    // });
        return this.getAll().map(tournaments => 
            tournaments.find(t => t.name === name))
    }

    public getOne(name: string): Observable<Tournament> {
        return this.http.get(URL +name)
            .map(result => {
                let data = result.json();
                return data.length > 0 ? new Tournament(data[0]) : null;
            });
    }

    public update(t: Tournament):  Observable<Tournament> {
        // console.log(t);
        return this.http.put(URL + t.name, Tools.removeCircularReferences(t)).map(result => {
            
            console.log("RESULT = " + result);
            return new Tournament(result.json());
            // return result.json().map(json => new Tournament(json));
        });
    }

    public delete(t: Tournament): Observable<boolean> {
        return this.http.delete(URL + t.name).map(res => true);
    }

    public add(t: Tournament): Observable<Tournament> {
        return this.http.post(URL, t).map(res => new Tournament(res.json()));
    }
}
