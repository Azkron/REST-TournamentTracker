import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MemberService } from "app/member/member.service";
import { MemberListComponent } from "app/member/memberlist.component";
import { TournamentService } from "app/tournament/tournament.service";
import { TournamentListComponent } from "app/tournament/tournamentlist.component";
// import { TournamentDetails } from "app/tournament/tournamentdetails.component";
import { LoginComponent } from "app/login/login.component";
import { HomeComponent } from "app/home/home.component";
import { UnknownComponent } from "app/unknown.component";

@NgModule({
    declarations: [
        AppComponent,
        MemberListComponent,
        TournamentListComponent,
        // TounamentDetails,
        LoginComponent,
        HomeComponent,
        UnknownComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: HomeComponent },
            { path: 'members', component: MemberListComponent },
            { path: 'tournaments', component: TournamentListComponent },
            // { path: 'tournamentdetails', component: TournamentDetails },
            { path: '**', component: UnknownComponent }
        ])
    ],
    providers: [
        MemberService,
        TournamentService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
