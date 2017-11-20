import { Component } from '@angular/core';
import { AuthService } from "app/auth.service";
import { MemberService } from "../member/member.service";
import { TournamentService } from "../tournament/tournament.service";

@Component({
    selector: 'app-root',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    public memberCount: number | '?' = '?';
    public tournamentCount: number | '?' = '?';

    constructor(public authService: AuthService, public memberService: MemberService, public tournamentService: TournamentService) {
        this.memberService.getCount().subscribe(c => this.memberCount = c);
        this.tournamentService.getCountTournament().subscribe(c => this.tournamentCount = c);
    }
}
