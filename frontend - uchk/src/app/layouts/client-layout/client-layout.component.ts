import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterPageComponent } from '../../shared/footer-page/footer-page.component';
import { HeaderPageComponent } from '../../shared/header-page/header-page.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderPageComponent, FooterPageComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent {

}
