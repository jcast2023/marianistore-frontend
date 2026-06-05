import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/newsletter/suscribir`;

  constructor(private http: HttpClient) {}

  registrarCorreo(email: string) {
    return this.http.post(this.apiUrl, { email });
  }
}
