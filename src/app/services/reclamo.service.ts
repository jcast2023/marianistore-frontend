import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
 private apiUrl = `${environment.apiUrl}/reclamaciones`;
  constructor(private http: HttpClient) {}

  registrarReclamo(reclamo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reclamo);
  }

  consultarSeguimiento(codigoReclamo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar/${codigoReclamo}`);
  }
}
