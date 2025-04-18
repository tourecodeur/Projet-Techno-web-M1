import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../authService/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { TypeDoc } from '../../models/typeDoc';

@Injectable({
  providedIn: 'root'
})
export class TypeDocService {

    private apiUrl = environment.apiEndpoint;

    constructor(private http: HttpClient, private authService: AuthService) {}

    // Méthode pour récupérer tous les types doc
    getTypesDoc() {
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

        return this.http.get<TypeDoc[]>(
            `${this.apiUrl}/typeDocuments`,
            { headers }
        );
    }

    // Méthode pour créer un nouveau type doc
    createTypeDoc(typeDoc: TypeDoc) {
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

        return this.http.post<TypeDoc>(
            `${this.apiUrl}/typeDocuments`,
            typeDoc,
            { headers }
        );
    }

    // Méthode pour mettre à jour un type doc existant
    updateTypeDoc(id:number, typeDoc: TypeDoc) {
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

        return this.http.put<TypeDoc>(
            `${this.apiUrl}/typeDocuments/${id}`,
            typeDoc,
            { headers }
        );
    }

    // Méthode pour supprimer un type doc
    deleteTypeDoc(id: number) {
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

        return this.http.delete(
            `${this.apiUrl}/typeDocuments/${id}`,
            { headers }
        );
    }

    
}
