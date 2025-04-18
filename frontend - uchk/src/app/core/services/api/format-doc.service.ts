import { FormatDoc } from './../../models/formatDoc';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../authService/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatDocService {

    private apiUrl = environment.apiEndpoint;

    constructor(private http: HttpClient, private authService: AuthService) {}

    // Méthode pour récupérer toutes les années académiques
    getFormatDoc() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token manquant');
            return throwError(
                // Retourner si le token est absent
                () => new Error('Token manquant')
            );
        }
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get<FormatDoc[]>(
            `${this.apiUrl}/formatDocuments`,
            { headers }
        );
    }

    // Méthode pour créer un nouveau format doc
    createFormatDoc(formatDoc: FormatDoc) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token manquant');
            return throwError(
                // Retourner si le token est absent
                () => new Error('Token manquant')
            );
        }
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.post<FormatDoc>(
            `${this.apiUrl}/formatDocuments`,
            formatDoc,
            { headers }
        );
    }

    // Méthode pour mettre à jour un format doc existant
    updateFormatDoc(id: number, formatDoc: FormatDoc) {
        const token = localStorage.getItem('token');

        if (!this.authService.isAdmin()) {
            throw new Error(
                'Vous devez être un administrateur pour effectuer cette action.'
            );
        }

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put<FormatDoc>(
            `${this.apiUrl}/formatDocuments/${id}`,
            formatDoc, {headers}
        );
    }

    // Méthode pour supprimer un format doc existant
    deleteFormatDoc(id: number) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token manquant');
            return throwError(
                // Retourner si le token est absent
                () => new Error('Token manquant')
            );
        }
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.delete(`${this.apiUrl}/formatDocuments/${id}`, {
            headers,
        });
    }

}
