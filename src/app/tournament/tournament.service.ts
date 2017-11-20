import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions } from "@angular/http";
import { SecuredHttp } from "../securedhttp.service";

import 'rxjs/add/operator/map';

export class Tournament {
    name: string;
    start: Date;
    finish: Date;
    maxPlayers: Number;

    constructor(data) {
        this.name = data.name;
        this.start = data.start;
        this.finish = data.finish;
        this.maxPlayers = data.maxPlayers;
    }
}

const URL = '/api/tournaments/';

@Injectable()
export class TournamentService {
    constructor(private http: SecuredHttp) {
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

    public update(t: Tournament): Observable<boolean> {
        console.log(t);
        return this.http.put(URL + t.name, t).map(res => true);
    }

    public delete(t: Tournament): Observable<boolean> {
        return this.http.delete(URL + t.name).map(res => true);
    }

    public add(t: Tournament): Observable<Tournament> {
        return this.http.post(URL, t).map(res => new Tournament(res.json()));
    }
}
