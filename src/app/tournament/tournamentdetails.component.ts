import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TournamentService, Tournament } from "app/tournament/tournament.service";

import 'rxjs/add/operator/switchMap';

  @Component({
    selector: 'tournamentdetails',
    templateUrl: 'tournamentlist.component.html'
})

export class TournamentListComponent implements OnInit {
    public tournamentDetail: Tournament;
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private TournamentService: TournamentService) { }

    ngOnInit() {
        this.tournamentDetail = this.route.paramMap
            .switchMap((params: ParamMap) =>
            this.TournamentService.getOne(params.get('name')));
        }
}