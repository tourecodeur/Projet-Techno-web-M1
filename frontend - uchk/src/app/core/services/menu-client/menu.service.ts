import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';
// Modifiez d'abord l'interface pour inclure les sous-menus optionnels
export interface MenuItem {
    title: string;
    icon: string;
    route: string;
    access: string[];
    children?: MenuItem[]; // Ajout des sous-menus optionnels
}

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private menus: MenuItem[] = [
        // Menu admin
        {
            title: 'Dashboard',
            route: './admin',
            icon: 'bi bi-speedometer',
            access: ['admin'],
        },
        {
            title: 'Utilisateurs',
            route: './admin/utilisateurs',
            icon: 'pi pi-users',
            access: ['admin'],
        },
        {
            title: 'Annonces',
            route: './admin/annonces',
            icon: 'bi bi-megaphone',
            access: ['admin'],
        },
        {
            title: 'Années académiques',
            route: './admin/anneesAcademiques',
            icon: 'bi bi-calendar',
            access: ['admin'],
        },
        {
            title: 'Candidatures',
            route: './admin/candidatures',
            icon: 'bi bi-folder',
            access: ['admin'],
        },
        {
            title: 'Documents',
            route: './admin/documents',
            icon: 'bi bi-files',
            access: ['admin'],
            children: [
                {
                    title: 'Mes documents',
                    route: './admin/MesDocuments',
                    icon: 'bi bi-files',
                    access: ['admin'],
                },
                {
                    title: 'Format document',
                    route: './admin/formatDocument',
                    icon: 'bi bi-file-earmark',
                    access: ['admin'],
                },
                {
                    title: 'Type document',
                    route: './admin/typeDocument',
                    icon: 'bi bi-file-text',
                    access: ['admin'],
                }
            ]
        },

        // Menu candidats
        {
            title: 'Dashboard',
            route: './candidat/dashboard',
            icon: 'bi bi-speedometer',
            access: ['candidat'],
        },
        {
            title: 'Annonces',
            route: './candidat/annonces',
            icon: 'bi bi-megaphone',
            access: ['candidat'],
        },
        {
            title: 'Mes Candidatures',
            route: './candidat/candidatures',
            icon: 'bi bi-folder',
            access: ['candidat'],
        },
        {
            title: 'Mes Documents',
            route: './candidat/Documents',
            icon: 'bi bi-files',
            access: ['candidat'],
        },
        {
            title: 'Mon compte',
            route: './candidat/compte',
            icon: 'bi bi-person-circle',
            access: ['candidat'],
        },

    ];

    constructor(private router: Router, private authService: AuthService) {}

    // Recuperer la liste des menus
    getMenusDash(): MenuItem[] {

        // Récupérer le role de l'utilisateur
        const userConnected = this.authService.getCurrentUser();
        // console.log('userConnected', userConnected);

        // Filtrer les menus en fonction du role
        if (userConnected) {
            this.menus = this.menus.filter((menu) => {
                return menu.access.includes(userConnected.role.toLowerCase());
            });
        }

        return this.menus;
    }
}
