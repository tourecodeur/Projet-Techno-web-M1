import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Annonce } from '../../../core/models/annonce';
import { AnnonceService } from '../../../core/services/api/annonce.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
    // tabAnnonces: any = [];

    // constructor(
    //     private annonceService: AnnonceService
    // ){}

    // ngOnInit(){ 
    //     this.getAllAnnonces();       
    // }

    // getAllAnnonces(){
    //     this.annonceService.getAnnonces().subscribe(
    //         (annonces) => {
    //             console.log("Liste des annonces: ", annonces);
    //         },
    //         (error) => {
    //             console.log("erreur: ", error);
    //         }
    //     )
    // }


  annonces: Annonce[] = [];

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    // this.getAllAnnonces();
    this.annonceService.getAnnonces().subscribe(
      (data) => {
        this.annonces = data
          .filter(annonce => annonce.dateLimite) 
          // Vérifie que dateLimite existe
          .sort((a, b) => new Date(b.dateLimite).getTime() - new Date(a.dateLimite).getTime()) 
          // Trier par dateLimite décroissante
          .slice(0, 4); // Prendre uniquement les 2 premières annonces
      },
      (error) => {
        console.error('Erreur lors de la récupération des annonces:', error);
      }
    );
  }

  getAllAnnonces(): void {
    this.annonceService.getAnnonces().subscribe({
  next: (data: Annonce[]) => {
    this.annonces = data;
    console.log("Annonces reçues :", this.annonces); // Debug
  },
  error: (err) => {
    console.error("Erreur lors de la récupération des annonces :", err);
  }
});

  }
}
