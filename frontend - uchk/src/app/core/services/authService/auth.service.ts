
import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/registerRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiEndpoint;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    /** Charge l'utilisateur depuis le localStorage au démarrage */
    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem('infosUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.currentUserSubject.next(user);
        }
    }

    /** Connexion */
    login(loginRequest: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest);
    }

    /** Inscription */
    inscription(registerRequest: RegisterRequest): Observable<RegisterRequest> {
        return this.http.post<RegisterRequest>(`${this.apiUrl}/auth/register`, registerRequest);
    }

    /** Stocke les données après connexion */
    setUserData(response: LoginResponse): void {
        // console.log("response login", response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('infosUser', JSON.stringify(response.infosUser));
        this.currentUserSubject.next(response.infosUser);
    }

    /** Déconnexion */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('infosUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    /** Récupère l'utilisateur actuel */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /** Vérifie si l'utilisateur est admin */
    isAdmin(): boolean {
        return this.getCurrentUser()?.role === 'ADMIN';
    }

    /** Vérifie si l'utilisateur est candidat */
    isCandidate(): boolean {
        return this.getCurrentUser()?.role === 'CANDIDAT';
    }

    /** Vérifie si un utilisateur est connecté */
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token') && !!localStorage.getItem('infosUser');
    }

    /** Auto login (appelé au démarrage de l'application) */
    autoLogin(): boolean {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('infosUser');
        
        if (token && user) {
            this.currentUserSubject.next(JSON.parse(user));
            return true;
        }
        return false;
    }
}
