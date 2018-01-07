import { Component, ViewChild, OnInit } from "@angular/core";
import { MemberService, Member } from "./member.service";
import { EditMemberComponent } from "./edit-member.component";
import { ColumnDef, MyTableComponent } from "../configdata/mytable.component";
import { SnackBarComponent } from "../configdata/snackbar.component";
import { Observable } from "rxjs/Observable";
import { Tools } from "../configdata/tools";


@Component({
    selector: 'edit-account',
    templateUrl: './edit-account.component.html',
})
export class EditAccountComponent implements OnInit{
    currentMember: Member;

    // @ViewChild('members') members: MyTableComponent;
    @ViewChild('addresses') addresses: MyTableComponent;

    // columnDefs: ColumnDef[] = [
    //     { name: 'pseudo', type: 'String', header: 'Pseudo', width: 1, key: true, filter: true, sort: 'asc' },
    //     { name: 'profile', type: 'String', header: 'Profile', width: 2, filter: true },
    //     { name: 'birthdate', type: 'Date', header: 'Birth Date', width: 1, filter: true, align: 'center' }
    // ];
    addressColumnDefs: ColumnDef[] = [
        { name: 'street_addr', type: 'String', header: 'Street Address', width: 1, filter: true, sort: 'asc' },
        { name: 'postal_code', type: 'String', header: 'Postal Code', width: 2, filter: true },
        { name: 'localization', type: 'Date', header: 'Localization', width: 1, filter: true, align: 'center' }
    ];

    constructor(private memberService: MemberService) {
    }

    ngOnInit(){
        
        this.memberService.getCurrent().subscribe(member => {
            this.currentMember = member;
        })
    }

    // get getDataService() {
    //     return m => this.memberService.getCurrent();
    // }

    // get addService() {
    //     return m => this.memberService.add(m);
    // }

    // get deleteService() {
    //     return m => this.memberService.delete(m);
    // }

    get updateService() {
        return m => this.memberService.updateCurrent(m);
    }

    // public selectedItemChanged(item) {
    //     this.currentMember = this.members.selectedItem as Member;
    //     if (this.addresses)
    //         this.addresses.refresh();
    // }

    get getAddressDataService() {
        return m => Observable.of(this.currentMember ? this.currentMember.address : null);
    }

    get addAddressService() {
        return a => {
            console.log("ADD", a, this.currentMember);
            // a.member = this.selectedMember;
            return this.memberService.addCurrentAddress(Tools.removeCircularReferences(a));
        };
    }

    get deleteAddressService() {
        return a => {
            // console.log("DEL", a);
            return this.memberService.deleteCurrentAddress(Tools.removeCircularReferences(a));
        };
    }

    get updateAddressService() {
        return a => {
            // console.log("UPD", a);
            // a.member = this.selectedMember;
            return this.memberService.updateCurrentAddress(Tools.removeCircularReferences(a));
        };
    }
}

