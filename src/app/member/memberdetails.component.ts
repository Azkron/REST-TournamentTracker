import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MemberService, Member } from "app/member/member.service";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/switchMap';

  @Component({
    selector: 'memberdetails',
    templateUrl: 'memberdetails.component.html'
})

export class MemberDetailsComponent implements OnInit {
    public memberDetails: Member;
    
    constructor(
		private route: ActivatedRoute,
        private router: Router,
        private MemberService: MemberService) { }

    ngOnInit() {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.MemberService.getOneDetails(params['pseudo']))
            .subscribe((m : Member) => this.memberDetails = m);
        }
}