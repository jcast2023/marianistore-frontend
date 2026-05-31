import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

interface DireccionDTO {
  idDireccion?: number;
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}

interface ItemPedidoDTO {
  idItemPedido?: number;
  idProducto: number;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario: number;
  imagen?: string;
}

interface PedidoDTO {
  idPedido?: number;
  idUsuario: number;
  emailUsuario?: string;
  fechaPedido: string;
  total: number;
  estado: string;
  metodoPago?: string;
  items: ItemPedidoDTO[];
  direccionEnvio?: DireccionDTO;
  idDireccionEnvio?: number;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  pedidos: PedidoDTO[] = [];
  cargando = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.verificarRetornoPago();
    this.cargarPedidos();
  }


  verificarRetornoPago(): void {
    this.route.queryParams.subscribe(params => {
      // 1. Capturamos los parámetros nativos que inyecta Mercado Pago
      const mpStatus = params['collection_status'] || params['status'];
      const pedidoId = params['external_reference'] || params['pedido'];

      // 2. Si existen parámetros de una transacción reciente
      if (mpStatus && pedidoId) {

        if (mpStatus === 'approved' || mpStatus === 'success') {
          // Limpiamos el carrito de compras local inmediatamente
          this.cartService.clearCart();

          Swal.fire({
            title: '¡Pago Exitoso!',
            text: `Tu pago para el pedido #${pedidoId} fue procesado correctamente por Mercado Pago.`,
            icon: 'success',
            confirmButtonColor: '#198754'
          });
        } else if (mpStatus === 'rejected' || mpStatus === 'failure') {
          Swal.fire({
            title: 'Pago Rechazado',
            text: `Hubo un problema al procesar el pago del pedido #${pedidoId}. Inténtalo de nuevo.`,
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        }

        // Opcional: Limpiar los parámetros de la URL para que no se repita el Swal si el usuario refresca la página
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }

  cargarPedidos(): void {
  this.cargando = true;
  const user = this.authService.getUserData();
  const userId = user?.idUsuario;

  if (!userId) {
    Swal.fire('Error', 'No se pudo identificar al usuario', 'error');
    this.cargando = false;
    return;
  }


  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  //  Pasar las { headers } en la petición GET
  this.http.get<PedidoDTO[]>(`http://localhost:8080/api/pedidos/usuario/${userId}`, { headers }).subscribe({
    next: (data) => {
      this.pedidos = data;
      this.cargando = false;
      console.log('Pedidos cargados:', this.pedidos);
    },
    error: (err) => {
      console.error('Error al cargar pedidos:', err);
      Swal.fire('Error', 'No se pudieron cargar los pedidos. Sesión expirada o inválida.', 'error');
      this.cargando = false;
    }
  });
}

  getEstadoBadgeClass(estado: string): string {
    const clases: any = {
      'PENDIENTE': 'bg-warning text-dark',
      'PENDIENTE_PAGO': 'bg-warning text-dark',
      'PAGADO': 'bg-success',
      'ENVIADO': 'bg-info',
      'ENTREGADO': 'bg-secondary',
      'CANCELADO': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }

  obtenerNombreMetodoPago(metodo: string): string {
    const nombres: any = {
      'TARJETA_CREDITO': 'Tarjeta de Crédito',
      'PAYPAL': 'PayPal',
      'TRANSFERENCIA': 'Transferencia Bancaria'
    };
    return nombres[metodo] || metodo;
  }

  verDetalles(pedido: PedidoDTO): void {
    const itemsHTML = pedido.items.map(item => `
      <tr>
        <td class="text-start">${item.nombreProducto || 'Producto'}</td>
        <td class="text-center">${item.cantidad}</td>
        <td class="text-end">S/ ${item.precioUnitario.toFixed(2)}</td>
        <td class="text-end fw-bold">S/ ${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
      </tr>
    `).join('');

    const metodoPagoHTML = pedido.metodoPago ? `
      <div class="mb-3">
        <strong><i class="bi bi-credit-card text-primary me-2"></i>Método de pago:</strong>
        <span class="badge bg-primary ms-2">${this.obtenerNombreMetodoPago(pedido.metodoPago)}</span>
      </div>
    ` : '';

    const direccionHTML = pedido.direccionEnvio ? `
      <div class="text-start mt-4 p-3 bg-light rounded">
        <h6 class="fw-bold mb-2">
          <i class="bi bi-geo-alt-fill text-primary me-2"></i>
          Dirección de envío:
        </h6>
        <p class="text-muted mb-1"><i class="bi bi-house-door me-2"></i>${pedido.direccionEnvio.calle}</p>
        <p class="text-muted mb-1"><i class="bi bi-geo me-2"></i>${pedido.direccionEnvio.ciudad}, ${pedido.direccionEnvio.estado} ${pedido.direccionEnvio.codigoPostal}</p>
        <p class="text-muted mb-0"><i class="bi bi-globe me-2"></i>${pedido.direccionEnvio.pais}</p>
      </div>
    ` : '<p class="text-muted mt-3">Sin dirección de envío registrada</p>';

    Swal.fire({
      title: `<i class="bi bi-receipt-cutoff"></i> Pedido #${pedido.idPedido}`,
      html: `
        <div class="text-start">
          <div class="row mb-3">
            <div class="col-6">
              <p class="mb-1"><strong>Fecha:</strong></p>
              <p class="text-muted">${new Date(pedido.fechaPedido).toLocaleString('es-PE')}</p>
            </div>
            <div class="col-6">
              <p class="mb-1"><strong>Estado:</strong></p>
              <span class="badge ${this.getEstadoBadgeClass(pedido.estado)}">${pedido.estado}</span>
            </div>
          </div>

          ${metodoPagoHTML}

          <hr>

          <h6 class="fw-bold mb-3">Productos:</h6>
          <table class="table table-sm table-hover">
            <thead class="table-light">
              <tr>
                <th>Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot class="table-light">
              <tr>
                <td colspan="3" class="text-end fw-bold">TOTAL:</td>
                <td class="text-end fw-bold text-success fs-5">S/ ${pedido.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          ${direccionHTML}
        </div>
      `,
      width: '700px',
      confirmButtonText: '<i class="bi bi-x-circle me-2"></i>Cerrar',
      confirmButtonColor: '#6c757d',
      showCancelButton: true,
      cancelButtonText: '<i class="bi bi-download me-2"></i>Descargar Factura',
      cancelButtonColor: '#198754'
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.descargarFactura(pedido.idPedido!);
      }
    });
  }

  generarPDF(pedido: PedidoDTO): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      Swal.fire('Error', 'No estás autenticado', 'error');
      return;
    }

    const url = `http://localhost:8080/api/pedidos/${pedido.idPedido}/factura`;

    Swal.fire({
      title: 'Abriendo PDF...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      Swal.close();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    })
    .catch(error => {
      console.error('Error al abrir PDF:', error);
      Swal.fire('Error', 'No se pudo abrir el PDF. Intenta descargarlo.', 'error');
    });
  }

  descargarFactura(idPedido: number): void {
  Swal.fire({
    title: 'Generando factura...',
    text: 'Por favor espera',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  //  OBTENER EL TOKEN E INYECTAR LAS CABECERAS
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  //  Pasar las { headers } junto al responseType
  this.http.get(`http://localhost:8080/api/pedidos/${idPedido}/factura`, {
    headers,
    responseType: 'blob'
  }).subscribe({
    next: (res: Blob) => {
      const fileURL = URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `factura_pedido_${idPedido}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);

      Swal.fire({
        title: '¡Factura descargada!',
        text: `Factura del pedido #${idPedido} descargada exitosamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Error en descarga:', err);
      Swal.fire({
        title: 'Error al descargar',
        text: 'No se pudo generar la factura. Verifica tu sesión o intenta más tarde.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  });
}

  calcularSubtotal(item: ItemPedidoDTO): number {
    return item.cantidad * item.precioUnitario;
  }
}
