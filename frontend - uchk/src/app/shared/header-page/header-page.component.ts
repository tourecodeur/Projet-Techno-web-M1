import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/authService/auth.service';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.css'
})
export class HeaderPageComponent {

    userConnected: any;
    userInfos: any;

    constructor(
        private authService: AuthService
    ){}

    ngOnInit(): void {
        this.getInfosUserConnected();
    }

    getInfosUserConnected(){
        this.userConnected = this.authService.isLoggedIn();
        // console.log("userConnected: ", this.userConnected);
        if(this.userConnected){
            this.userInfos = this.authService.getCurrentUser();
            // console.log("userInfos: ", this.userInfos);
        }else{
            this.userInfos = null;

        }
    }

    logoutUser(){
        this.authService.logout();
    }

}
