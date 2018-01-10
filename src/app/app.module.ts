import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { MemberService } from "app/member/member.service";
import { MemberListComponent } from "app/member/memberlist.component";
import { MemberDetailsComponent } from "app/member/memberdetails.component";

import { TournamentService } from "app/tournament/tournament.service";
import { TournamentListComponent } from "app/tournament/tournamentlist.component";
import { TournamentDetailsComponent } from "app/tournament/tournamentdetails.component";

import { GameService } from "app/game/game.service";

import { LoginComponent } from "app/login/login.component";
import { HomeComponent } from "app/home/home.component";
import { UnknownComponent } from "app/unknown.component";
import { SecuredHttp } from "app/securedhttp.service";
import { AuthGuard, AdminGuard } from "app/auth-guard.service";
import { AuthService } from "app/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RestrictedComponent } from "app/restricted.component";
import { LogoutComponent } from 'app/logout.component';
import { EditMemberComponent } from "app/member/edit-member.component";
import { EditAccountComponent } from "app/member/edit-account.component";
import { EditTournamentComponent } from "app/tournament/edit-tournament.component";
import { EditGameComponent } from "app/game/edit-game.component";
import { SnackBarComponent } from "./configdata/snackbar.component";
import { MyTableComponent } from "./configdata/mytable.component";
import { MyInputComponent } from "./configdata/myinput.component";
import { ValidationService } from "app/validation.service";
import { MyModalComponent } from "./configdata/mymodal.component";
import { SignUpComponent } from 'app/signup/signup.component';
import { EditAddressComponent } from 'app/member/edit-address.component';
import { ConfirmDelete } from "app/confirm-delete.component";


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(
        new AuthConfig({
            tokenGetter: (() => sessionStorage.getItem('id_token'))
        }),
        http,
        options
    );
}

@NgModule({
    declarations: [
        AppComponent,
        MemberListComponent,
        MemberDetailsComponent,
        TournamentListComponent,
        TournamentDetailsComponent,
        LoginComponent,
        SignUpComponent,
        LogoutComponent,
        HomeComponent,
        UnknownComponent,
        RestrictedComponent,
        EditMemberComponent,
        EditAccountComponent,
        EditTournamentComponent,
        EditGameComponent,
        SnackBarComponent,
        MyTableComponent,
        MyInputComponent,
        MyModalComponent,
        EditAddressComponent,
        ConfirmDelete
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignUpComponent },
            { 
                path: '',
                canActivate: [AuthGuard],
                children: [
                    { path: 'logout', component: LogoutComponent },
                    { path: 'home', component: HomeComponent },
                    { path: 'account', component: EditAccountComponent },
                    { path: 'tournaments', component: TournamentListComponent },
                    {
                        path: '',
                        canActivate: [AdminGuard],
                        children: [
                            { path: 'members', component: MemberListComponent },
                            { path: 'memberdetails/:pseudo', component: MemberDetailsComponent },
                            { path: 'tournamentdetails/:name', component: TournamentDetailsComponent },
                        ]
                    },                                   
                ]
            },
            { path: 'restricted', component: RestrictedComponent},           
            { path: '**', component: UnknownComponent }
        ])
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        SecuredHttp,
        AuthGuard,
        AdminGuard,
        AuthService,
        MemberService,
        TournamentService,
        GameService,
        ValidationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
