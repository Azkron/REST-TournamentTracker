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
import { EditTournamentComponent } from "app/tournament/edit-tournament.component";
import { SnackBarComponent } from "app/snackbar.component";
import { MyTableComponent } from "app/mytable.component";
import { MyInputComponent } from "app/myinput.component";
import { ValidationService } from "app/validation.service";
import { MyModalComponent } from "app/mymodal.component";

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
        LogoutComponent,
        HomeComponent,
        UnknownComponent,
        RestrictedComponent,
        EditMemberComponent,
        EditTournamentComponent,
        SnackBarComponent,
        MyTableComponent,
        MyInputComponent,
        MyModalComponent,
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { 
                path: '',
                canActivate: [AuthGuard],
                children: [
                    { path: 'logout', component: LogoutComponent },
                    { path: 'home', component: HomeComponent },
                    {
                        path: '',
                        canActivate: [AdminGuard],
                        children: [
                            { path: 'members', component: MemberListComponent },
                            // { path: 'memberdetails/:pseudo', component: MemberDetailsComponent },
                            { path: 'tournaments', component: TournamentListComponent },
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
        ValidationService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
