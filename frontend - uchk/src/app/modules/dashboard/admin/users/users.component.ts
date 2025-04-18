import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidatService } from '../../../../core/services/api/candidat.service';
import { GestionAdminComponent } from "../gestion-admin/gestion-admin.component";
import { GestionCandidatComponent } from "../gestion-candidat/gestion-candidat.component";
import { AdminService } from '../../../../core/services/api/admin.service';
import { Chart } from 'chart.js/auto';
import { UserService } from '../../../../core/services/api/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GestionAdminComponent, GestionCandidatComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
    tabUsers: any = [];
    tabUsersFiltered: any = [];
    tabAdmins: any = [];
    tabCandidats: any = [];
    afficherAdmin = false;
    afficherCandidat = false;

    constructor(
        private candidatService: CandidatService,
        private adminService: AdminService,
        private userService : UserService
    ){}

    ngOnInit(): void {
        this.getAllAdmins();
        this.getAllCandidats();
        this.getAllUsers();
    }

    afficherAdmins(): void {
        this.afficherAdmin = true;
        this.afficherCandidat = false;
    }

    afficherCandidats(): void {
        this.afficherAdmin = false;
        this.afficherCandidat = true;
    }

    getAllAdmins(){
        this.adminService.getAdmins().subscribe({
            next: (res) => {
                this.tabAdmins = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    getAllCandidats(){
        this.candidatService.getCandidats().subscribe({
            next: (res) => {
                this.tabCandidats = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    getAllUsers(){
        this.userService.getUsers().subscribe({
            next: (res) => {
                this.tabUsers = res;
                this.tabUsersFiltered = this.tabUsers;
                this.initChart();
                // console.log("liste des utilisateurs: ", this.tabUsersFiltered);
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    initChart() {
        const ctx = document.getElementById('candidatureChart') as HTMLCanvasElement;
        // console.log("ctx: ", ctx);

        // Compter les différents états
        const administrateurs = this.tabUsersFiltered.filter((user: any) => user.role === 'ADMIN').length;
        const candidats = this.tabUsersFiltered.filter((user: any) => user.role === 'CANDIDAT').length;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Administrateurs', 'Candidats'],
                datasets: [{
                    data: [administrateurs, candidats],
                    backgroundColor: [
                        '#1879BC',  // bleu pour admins
                        '#FFD700',  // jaune pour candidats
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '60%'
            }
        });
    }

}
