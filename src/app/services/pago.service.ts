import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl     = `${environment.apiUrl}/pagos`;
  private pedidosUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  // Crear preferencia de Mercado Pago
  crearPreferencia(pedidoId: number, monto: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/preferencia`, {
      pedidoId,
      descripcion: 'Compra en MarianíStore',
      monto,
      email
    });
  }

  // PayPal / Transferencia
  pagarPedido(idPedido: number, metodoPago?: string): Observable<any> {
    let url = `${this.pedidosUrl}/${idPedido}/pagar`;
    if (metodoPago) url += `?metodoPago=${metodoPago}`;
    return this.http.put(url, {});
  }

  descargarFactura(idPedido: number): Observable<Blob> {
    return this.http.get(`${this.pedidosUrl}/${idPedido}/factura`, {
      responseType: 'blob'
    });
  }
}
