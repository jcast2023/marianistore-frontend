import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // ajusta si tu env está en otro lugar
import { DireccionDTO } from '../models/direccion-dto';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private apiUrl = `${environment.apiUrl}/direcciones`; // ej: http://localhost:8080/api/direcciones

  constructor(private http: HttpClient) {}

  obtenerPorUsuarioId(idUsuario: number): Observable<DireccionDTO[]> {
    return this.http.get<DireccionDTO[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  crearDireccion(direccion: DireccionDTO): Observable<DireccionDTO> {
    return this.http.post<DireccionDTO>(this.apiUrl, direccion);
  }

  actualizarDireccion(id: number, direccion: DireccionDTO): Observable<DireccionDTO> {
    return this.http.put<DireccionDTO>(`${this.apiUrl}/${id}`, direccion);
  }

  eliminarDireccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
