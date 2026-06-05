import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  cargando = true;
  terminoBusqueda: string = '';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPedidosGlobales();
  }

  cargarPedidosGlobales() {
    this.http.get<any[]>(`${this.apiUrl}/pedidos`).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.pedidosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener pedidos globales:', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los pedidos del servidor.', 'error');
      }
    });
  }

  filtrarPedidos() {
    const term = this.terminoBusqueda.toLowerCase().trim();
    if (!term) {
      this.pedidosFiltrados = [...this.pedidos];
      return;
    }
    this.pedidosFiltrados = this.pedidos.filter(p => {
      const idCoincide = p.idPedido?.toString().includes(term);
      const emailCoincide = p.emailUsuario?.toLowerCase().includes(term);
      return idCoincide || emailCoincide;
    });
  }

  actualizarEstado(idPedido: number, nuevoEstado: string) {
    Swal.fire({
      title: '¿Confirmar despacho?',
      text: `El pedido #${idPedido} se marcará como ENVIADO.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, despachar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Actualizando...',
          didOpen: () => { Swal.showLoading(); }
        });

        this.http.patch(`${this.apiUrl}/pedidos/${idPedido}/estado`, { estado: nuevoEstado })
          .subscribe({
            next: () => {
              const pedido = this.pedidos.find(p => p.idPedido === idPedido);
              if (pedido) pedido.estado = nuevoEstado;
              this.filtrarPedidos();
              Swal.fire('¡Éxito!', 'El pedido ha sido despachado.', 'success');
            },
            error: (err) => {
              console.error('Error al cambiar estado:', err);
              Swal.fire('Error de Conexión', 'No se pudo actualizar el estado.', 'error');
            }
          });
      }
    });
  }

  descargarFactura(idPedido: number) {
    const url = `${this.apiUrl}/pedidos/${idPedido}/factura`;

    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `factura_${idPedido}.pdf`;
        a.click();
        toast.fire({ icon: 'success', title: 'Factura descargada' });
      },
      error: () => {
        Swal.fire('Error', 'La factura no está disponible en este momento.', 'error');
      }
    });
  }
}
