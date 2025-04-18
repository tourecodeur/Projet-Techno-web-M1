import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authService/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Annonce } from '../../models/annonce';


@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

    private apiUrl = environment.apiEndpoint;

    constructor(
        private http: HttpClient
    ) {}
    

    // Récupérer toutes les annonces (avec typage)
    getAnnonces(): Observable<Annonce[]> {
        return this.http.get<Annonce[]>(`${this.apiUrl}/annonces`);
    }

    // Récupérer une annonce par son ID (avec typage)
    getAnnonce(id: number): Observable<Annonce> {
        return this.http.get<Annonce>(`${this.apiUrl}/annonces/${id}`);
    }

    
    // Ajouter une annonce
    addAnnonce(annonce: Annonce) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(`${this.apiUrl}/annonces`, annonce, { headers });
    }

    // Mettre à jour une annonce
    updateAnnonce(id: number, annonce: Annonce) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.put(`${this.apiUrl}/annonces/${id}`, annonce, { headers });
    }

    // Supprimer une annonce
    deleteAnnonce(id: number) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.delete(`${this.apiUrl}/annonces/${id}`, { headers });
    }

}
