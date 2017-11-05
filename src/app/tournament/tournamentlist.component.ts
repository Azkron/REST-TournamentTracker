import { Component, OnInit } from '@angular/core';
import { TournamentService, Tournament } from "app/tournament/tournament.service";

@Component({
    selector: 'tournamentlist',
    templateUrl: 'tournamentlist.component.html'
})

export class TournamentListComponent implements OnInit {
    public tournaments: Tournament[];
    
    constructor(private TournamentService: TournamentService) { }

    ngOnInit() {
        this.TournamentService.getAll().subscribe(res => {
            this.tournaments = res;
        })
    }
}