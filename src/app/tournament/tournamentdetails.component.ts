import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TournamentService, Tournament } from "app/tournament/tournament.service";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/switchMap';

  @Component({
    selector: 'tournamentdetails',
    templateUrl: 'tournamentdetails.component.html'
})

export class TournamentDetailsComponent implements OnInit {
    public tournamentDetails: Observable<Tournament>;
    
    constructor(
		private route: ActivatedRoute,
        private router: Router,
        private TournamentService: TournamentService) { }

    ngOnInit() {
        this.tournamentDetails = this.route.paramMap
            .switchMap((params: ParamMap) =>
            this.TournamentService.getOneDetails(params.get('name')));
        }
}