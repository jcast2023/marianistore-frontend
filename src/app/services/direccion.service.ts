import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DireccionDTO } from '../models/direccion-dto';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private apiUrl = `${environment.apiUrl}/direcciones`;

  constructor(private http: HttpClient) {}

  // El interceptor se encarga automáticamente de las cabeceras HTTP.
  // Tus métodos ya no necesitan pasar el objeto `{ headers: ... }`

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
