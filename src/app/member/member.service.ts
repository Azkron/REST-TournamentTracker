import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Http, RequestOptions } from "@angular/http";
import { SecuredHttp } from "app/securedhttp.service";
import { Tournament }  from "../tournament/tournament.service"
import { Tools } from "../configdata/tools";

export class Address {
    _id: string;
    street_addr: string;
    postal_code: string;
    localization: string;
    member: Member;

    constructor(data) {
        this._id = data._id;
        this.street_addr = data.street_addr;
        this.postal_code = data.postal_code;
        this.localization = data.localization;
        this.member = data.member;
    }
}

export class Member {
    _id: string;
    pseudo: string;
    password: string;
    profile: string;
    birthdate: string;
    address: Address[];
    tournaments: Tournament[];
    admin: boolean;

    constructor(data) {
        this._id = data._id;
        this.pseudo = data.pseudo;
        this.password = data.password;
        this.profile = data.profile;
        this.birthdate = data.birthdate &&
            data.birthdate.length > 10 ? data.birthdate.substring(0, 10) : data.birthdate;
        this.address = data.addresses;
        this.tournaments = data.tournaments;
        this.admin = data.admin;
    }
}

const URL = '/api/members/';

@Injectable()
export class MemberService {
    constructor(private http: SecuredHttp) {
    }

    public getUnassignedDataService(id: String): Observable<Member[]> {
        return this.http.get(URL + "getUnassignedMembers/" +id) 
            .map(result => {
                return result.json().map(json => new Member(json));
            });
    }

    public getCountMembersUnassigned(id: String): Observable<number> {
        return this.http.get(URL + 'countMemberUnassigned/' +id)
            .map(result => {
                return result.json();
            })
    }


    public getCountMembersAssigned(id: String): Observable<number> {
        return this.http.get(URL + 'countMemberAssigned/' +id)
            .map(result => {
                return result.json();
            })
    }

    public getCount(): Observable<number> {
        return this.http.get(URL + 'count')
            .map(result => {
                return result.json();
            })
    }

    public getAll(): Observable<Member[]> {
        return this.http.get(URL)
            .map(result => {
                return result.json().map(json => new Member(json));
            });
    }

    public getOneDetails(pseudo: string): Observable<Member> {
        return this.getAll().map(members => 
            members.find(m => m.pseudo === pseudo))
    }

    public getOne(pseudo: string): Observable<Member> {
        return this.http.get(URL + pseudo)
            .map(result => {
                let data = result.json();
                return data.length > 0 ? new Member(data[0]) : null;
            });
    }

    public getCurrent(): Observable<Member> {
        return this.http.get(URL + '/current')
            .map(result => {
                let data = result.json();
                return data.length > 0 ? new Member(data[0]) : null;
            });
    }

    public updateCurrent(m: Member): Observable<boolean> {
        return this.http.put(URL + '/current', Tools.removeCircularReferences(m)).map(res => {console.log(res); return true;});
    }

    public update(m: Member): Observable<boolean> {
        return this.http.put(URL + m.pseudo, Tools.removeCircularReferences(m)).map(res => {console.log(res); return true;});
    }

    public delete(m: Member): Observable<boolean> {
        return this.http.delete(URL + m.pseudo).map(res => true);
    }

    public add(m: Member): Observable<Member> {
        return this.http.post(URL, m).map(res => new Member(res.json()));
    }

    public addAddress(m: Member, a: Address) {
        return this.http.post(URL + 'address/' + m.pseudo, Tools.removeCircularReferences(a)).map(res => new Address(res.json()));
    }

    public addCurrentAddress( a: Address) {
        return this.http.post(URL + 'address/current', Tools.removeCircularReferences(a)).map(res => new Address(res.json()));
    }

    public deleteAddress(m: Member, a: Address) {
        return this.http.delete(URL + 'address/' + m.pseudo + '/' + a._id).map(res => true);
    }

    public deleteCurrentAddress( a: Address) {
        return this.http.delete(URL + 'address/current/' + a._id).map(res => true);
    }

    public updateAddress(m: Member, a: Address) {
        return this.http.put(URL + 'address/' + a._id, a).map(res => true);
    }

    public updateCurrentAddress( a: Address) {
        return this.http.put(URL + 'address/current/' + a._id, a).map(res => true);
    }
}
