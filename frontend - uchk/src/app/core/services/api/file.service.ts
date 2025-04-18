import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
    // Url de base de l'API
    private apiUrl = 'http://localhost:8080/api/files';

    // Construteur de la classe
    constructor(private http: HttpClient) { }

    // Méthode pour enregistrer un fichier
    uploadFile(file: File): Observable<any> {
        const formData = new FormData();

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        formData.append('file', file);
        return this.http.post(`${this.apiUrl}/upload`, formData, {headers});
    }

    // Méthode pour récupérer un fichier par son ID
    getFile(id: number): Observable<any> {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/${id}`, {headers});
    }

    // Méthode pour récupérer un fichier par son nom
    getFileByName(fileName: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/download/${fileName}`, {
            responseType: 'blob'
        });
    }

    // Méthode utilitaire pour construire l'URL complète
    getFileUrl(fileName: string): string {
        return `${this.apiUrl}/download/${fileName}`;
    }

}
