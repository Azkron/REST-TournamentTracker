import { Component } from '@angular/core';
import { AuthService } from "./auth.service"

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(public authService : AuthService) {}    // necessaire car utilisé en binding dans le template
}
