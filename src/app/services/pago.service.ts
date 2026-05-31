import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = `${environment.apiUrl}/pagos`;
  private pedidosUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  // ← ACTUALIZAR ESTE MÉTODO para recibir el método de pago
  pagarPedido(idPedido: number, metodoPago?: string): Observable<any> {
    // Construir URL con parámetros
    let url = `${this.pedidosUrl}/${idPedido}/pagar`;

    // Si se proporciona método de pago, agregarlo como parámetro
    if (metodoPago) {
      url += `?metodoPago=${metodoPago}`;
    }

    return this.http.put(url, {});
  }

  descargarFactura(idPedido: number): Observable<Blob> {
    return this.http.get(`${this.pedidosUrl}/${idPedido}/factura`, {
      responseType: 'blob'
    });
  }
}
