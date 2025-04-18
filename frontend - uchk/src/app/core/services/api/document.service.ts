import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  uploadDocument(formData: FormData): Observable<any> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${token}`
    );

    return this.http.post(this.apiUrl, formData, {headers});
  }

  getDocuments(): Observable<Document[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${token}`
    );

    return this.http.get<Document[]>(this.apiUrl, {headers});
  }

  getDocument(id: number): Observable<Document> {

    const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

    return this.http.get<Document>(`${this.apiUrl}/${id}`, {headers});
  }

  downloadDocument(id: number): Observable<Blob> {

    const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

    return this.http.get(`${this.apiUrl}/${id}`, {
      responseType: 'blob',
      headers
    });
  }

  updateDocument(id: number, formData: FormData): Observable<any> {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

        return this.http.put(`${this.apiUrl}/${id}`, formData, {headers});
  }

  deleteDocument(id: number): Observable<void> {

    const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${token}`
        );

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers});
  }
}
