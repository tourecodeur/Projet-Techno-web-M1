import { AuthService } from './core/services/authService/auth.service';

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

    constructor(private authService: AuthService){}

    ngOnInit() {
        AOS.init();
        this.authService.autoLogin();
    }
}
