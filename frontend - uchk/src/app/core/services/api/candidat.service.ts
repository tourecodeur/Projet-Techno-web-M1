import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CandidatService {

    private apiUrl = environment.apiEndpoint;

    constructor(
        private http: HttpClient,
    ) { }

    // service pour récupérer toutes les candidats
    getCandidats() {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/candidats`, {headers});
    }

    // service pour récupérer un candidat par son ID
    getCandidat(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/candidats/${id}`, {headers});
    }

    // service pour ajouter un candidat
    addCandidat(candidat: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.post(`${this.apiUrl}/candidats`, candidat, {headers});
    }

    // service pour mettre à jour un candidat
    updateCandidat(id: number, candidat: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put(`${this.apiUrl}/candidats/${id}`, candidat, {headers});
    }

    // service pour supprimer un candidat
    deleteCandidat(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.delete(`${this.apiUrl}/candidats/${id}`, {headers});
    }
}
