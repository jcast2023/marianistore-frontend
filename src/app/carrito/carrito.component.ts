import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { DireccionService } from '../services/direccion.service';
import { DireccionDTO } from '../models/direccion-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  direcciones: DireccionDTO[] = [];
  direccionSeleccionadaId: number | null = null;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private direccionService: DireccionService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItems = items || [];
        this.total = this.cartService.getTotal();
      },
      error: (err) => console.error('❌ Error en suscripción de carrito:', err)
    });

    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    const user = this.authService.getUserData();
    const userId = user?.idUsuario;

    if (userId) {
      this.direccionService.obtenerPorUsuarioId(userId).subscribe({
        next: (dirs) => {
          console.log('✅ Direcciones cargadas:', dirs);
          this.direcciones = dirs || [];

          if (this.direcciones.length > 0) {
            this.direccionSeleccionadaId = this.direcciones[0].idDireccion!;
            console.log('✅ Dirección seleccionada por defecto:', this.direccionSeleccionadaId);
          } else {
            this.direccionSeleccionadaId = null;
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar direcciones:', err);
          Swal.fire('Error', 'No se pudieron cargar las direcciones', 'error');
        }
      });
    }
  }

  onDireccionChange(): void {
    console.log('🔄 Dirección cambiada a:', this.direccionSeleccionadaId);
    const direccion = this.direcciones.find(d => d.idDireccion === Number(this.direccionSeleccionadaId));
    if (direccion) {
      console.log('✅ Dirección válida seleccionada:', direccion);
    } else {
      console.warn('⚠️ Dirección no encontrada en el catálogo local');
    }
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn) {
      Swal.fire('Sesión Expirada', 'Por favor, reingresa a tu cuenta.', 'warning');
      this.authService.logout();
      return;
    }

    const user = this.authService.getUserData();
    if (!user || !user.idUsuario) {
      Swal.fire('Error', 'No se pudo identificar al usuario logueado.', 'error');
      return;
    }

    if (!this.direccionSeleccionadaId) {
      Swal.fire({
        title: 'Dirección requerida',
        text: 'Debes seleccionar una dirección de envío antes de continuar',
        icon: 'warning',
        confirmButtonText: 'Agregar Dirección',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/direcciones']);
        }
      });
      return;
    }

    const direccionId = Number(this.direccionSeleccionadaId);
    const direccionValida = this.direcciones.find(d => d.idDireccion === direccionId);

    if (!direccionValida) {
      Swal.fire({
        title: 'Dirección no válida',
        text: 'La dirección seleccionada ya no está disponible. Por favor, selecciona otra o recarga la página.',
        icon: 'error',
        confirmButtonText: 'Recargar direcciones'
      }).then(() => {
        this.cargarDirecciones();
      });
      return;
    }

    const pedidoDTO = {
      idUsuario: user.idUsuario,
      total: this.total,
      fechaPedido: new Date().toISOString(),
      estado: 'PENDIENTE',
      idDireccionEnvio: direccionId,
      items: this.cartItems.map(item => ({
        idProducto: item.product?.idProducto,
        cantidad: item.quantity,
        precioUnitario: item.product?.precio || 0
      }))
    };

    Swal.fire({
      title: 'Confirmar pedido',
      html: `
        <div class="text-start">
          <p><strong>Total:</strong> S/ ${this.total.toFixed(2)}</p>
          <p><strong>Envío a:</strong></p>
          <p class="text-muted mb-0">${direccionValida.calle}</p>
          <p class="text-muted mb-0">${direccionValida.ciudad}, ${direccionValida.estado}</p>
          <p class="text-muted">${direccionValida.pais}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, proceder al pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearPedido(pedidoDTO);
      }
    });
  }

  private crearPedido(pedidoDTO: any): void {
    Swal.fire({
      title: 'Procesando pedido...',
      text: 'Estamos preparando tu orden en tiendaonline',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post('http://localhost:8080/api/pedidos', pedidoDTO).subscribe({
      next: (pedidoCreado: any) => {
        Swal.fire({
          title: '¡Pedido creado!',
          text: `Pedido #${pedidoCreado.idPedido} listo para pagar`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.cartService.clearCart();
          this.router.navigate(['/pago', pedidoCreado.idPedido]);
        });
      },
      error: (err) => {
        console.error('Error detallado:', err);
        Swal.fire({
          title: 'Error al crear pedido',
          text: err.error?.message || 'Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }

  irADirecciones(): void {
    this.router.navigate(['/direcciones']);
  }

  // ✅ TIPADO BLINDADO: Acepta opcionalidad para evitar errores de compilación estricta
  updateQuantity(idProducto: number | undefined, nuevaCantidad: number): void {
    if (idProducto === undefined || idProducto === null || nuevaCantidad < 1) return;

    const item = this.cartItems.find(i => i.product?.idProducto === idProducto);
    if (item && item.product) {
      const stockMaximo = item.product.stock !== undefined ? Number(item.product.stock) : 99;
      if (nuevaCantidad > stockMaximo) {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `Solo quedan ${stockMaximo} unidades disponibles de "${item.product.nombre}".`,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#2b4c3f'
        });
        return;
      }
    }

    this.cartService.updateQuantity(idProducto, nuevaCantidad);
  }

  // ✅ TIPADO BLINDADO: Acepta opcionalidad
  removeItem(idProducto: number | undefined): void {
    if (idProducto === undefined || idProducto === null) return;

    const item = this.cartItems.find(i => i.product?.idProducto === idProducto);
    const nombreProducto = item?.product?.nombre || 'este producto';

    Swal.fire({
      title: '¿Quitar producto?',
      text: `Se eliminará "${nombreProducto}" del carrito.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(idProducto);
      }
    });
  }
}
