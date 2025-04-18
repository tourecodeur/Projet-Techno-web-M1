import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarDashComponent } from '../../shared/sidebar-dash/sidebar-dash.component';
import { NavbarDashComponent } from '../../shared/navbar-dash/navbar-dash.component';

@Component({
    selector: 'app-dash-layout',
    standalone: true,
    imports: [RouterOutlet, CommonModule, SidebarDashComponent, NavbarDashComponent],
    templateUrl: './dash-layout.component.html',
    styleUrl: './dash-layout.component.css',
})
export class DashLayoutComponent {
    isSidebarVisible = false;

    // sidebar toggle
    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }

    // sidebar close
    closeSidebar() {
        this.isSidebarVisible = true;
    }
}
