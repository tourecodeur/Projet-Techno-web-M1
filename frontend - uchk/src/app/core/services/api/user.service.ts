import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiEndpoint;

    constructor(
        private http: HttpClient,
    ) { }

    // service pour récupérer toutes les users
    getUsers() {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/users`, {headers});
    }

    // service pour récupérer un user par son ID
    getUser(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/users/${id}`, {headers});
    }

    // service pour ajouter un user
    addUser(user: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.post(`${this.apiUrl}/users`, user, {headers});
    }

    // service pour mettre à jour un user
    updateUser(id: number, user: any) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put(`${this.apiUrl}/users/${id}`, user, {headers});
    }

    // service pour supprimer un user
    deleteUser(id: number) {
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.delete(`${this.apiUrl}/users/${id}`, {headers});
    }
}
