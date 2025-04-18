import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authService/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
    private apiUrl = environment.apiEndpoint;

    constructor(
        private http: HttpClient
    ) { }

    getCandidatures(){
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/candidatures`, {headers});
    }

    getCandidatureById(id: number){
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.get(`${this.apiUrl}/candidatures/${id}`, {headers});
    }

    addCandidature(candidature: any){
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.post(`${this.apiUrl}/candidatures`, candidature, {headers});
    }

    updateCandidature(id: number, candidature: any){
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put(`${this.apiUrl}/candidatures/${id}`, candidature, {headers});
    }

    deleteCandidature(id: number){
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.delete(`${this.apiUrl}/candidatures/${id}`, {headers});
    }
    
}
