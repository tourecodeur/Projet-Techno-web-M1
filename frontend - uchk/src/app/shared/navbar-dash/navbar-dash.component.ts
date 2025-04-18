import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/authService/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar-dash',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-dash.component.html',
  styleUrl: './navbar-dash.component.css'
})
export class NavbarDashComponent {

    infoUser: any;

    constructor(private route: Router, private authService: AuthService, private toastr: ToastrService,) { }

    ngOnInit(): void {
        this.userConnected();
    }

    logout() {
        this.authService.logout();
        this.toastr.success('Déconnexion réussie');
        window.location.href = '/login';
    }

    userConnected() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.infoUser = user
            return true;
        }
        return false;
    }

}
