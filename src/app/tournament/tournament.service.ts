import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions } from "@angular/http";
import { SecuredHttp } from "../securedhttp.service";
import { Member} from "../member/member.service"

import 'rxjs/add/operator/map';

export class Tournament {
    _id: string;
    name: string;
    start: string;
    finish: string;
    maxPlayers: Number;
    member: Member[];

    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.start = data.start && data.start.length > 10 ? data.start.substring(0, 10) : data.start;
        this.finish = data.finish && data.finish.length > 10 ? data.finish.substring(0, 10) : data.finish;
        this.maxPlayers = data.maxPlayers;
        this.member = data.members;
    }
}

const URL = '/api/tournaments/';

@Injectable()
export class TournamentService {
    constructor(private http: SecuredHttp) {
    }

    public getCountMembersUnassigned(): Observable<number> {
        return this.http.get(URL + 'countMemberUnassigned')
            .map(result => {
                return result.json();
            })
    }


    public getCountMembersAssigned(): Observable<number> {
        return this.http.get(URL + 'countMemberAssigned')
            .map(result => {
                return result.json();
            })
    }

    // get getUnassignedDataService() {
    //     return t => this.TournamentService.getAll();
    // }

    // get getAssignedDataService() {
    //     return t => this.TournamentService.getAll();
    // }

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
