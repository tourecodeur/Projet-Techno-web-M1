import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

    private apiUrl = environment.apiEndpoint;

    constructor(
        private http: HttpClient,
    ) { }

    // service pour récupérer tous les admins
    getAdmins() {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/admins`, {headers});
    }

    // service pour récupérer un admin par son ID
    getAdmin(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/admins/${id}`, {headers});
    }

    // service pour ajouter un admin
    addAdmin(admin: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.post(`${this.apiUrl}/admins`, admin, {headers});
    }

    // service pour mettre à jour un admin
    updateAdmin(id: number, admin: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put(`${this.apiUrl}/admins/${id}`, admin, {headers});
    }

    // service pour supprimer un admin
    deleteAdmin(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.delete(`${this.apiUrl}/admins/${id}`, {headers});
    }

}
