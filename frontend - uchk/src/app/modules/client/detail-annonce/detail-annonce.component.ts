import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnonceService } from '../../../core/services/api/annonce.service';
import { Annonce } from '../../../core/models/annonce';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/authService/auth.service';

@Component({
  selector: 'app-detail-annonce',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-annonce.component.html',
  styleUrl: './detail-annonce.component.css'
})
export class DetailAnnonceComponent implements OnInit {
  isCandidat: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private annonceService: AnnonceService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  annonce!: Annonce;

  ngOnInit(): void {
    this.checkUserRole();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getAnnonceById(id);
    }
  }

  checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (user?.role === 'CANDIDAT') {
      this.isCandidat = true;
    } else {
      this.isCandidat = false;
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getAnnonceById(id: number): void {
    this.annonceService.getAnnonce(id).subscribe({
      next: (data: Annonce) => {
        this.annonce = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'annonce :", err);
      }
    });
  }
  
}
