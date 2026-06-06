import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
interface Direccion {
  idDireccion: number;
  calle: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  pasoActual = 1;
  cartItems: CartItem[] = [];
  direcciones: Direccion[] = [];
  idDireccionSeleccionada: number | null = null;
  metodoPago: string = 'TARJETA_CREDITO';
  isLoading = false;
  isLoadingDirecciones = false;
  errorMsg = '';
  pedidoCreado: any = null;



  metodosPago = [
    { valor: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito', icono: 'fa-credit-card' },
    { valor: 'PAYPAL',          label: 'PayPal',             icono: 'fa-paypal' },
    { valor: 'TRANSFERENCIA',   label: 'Transferencia',      icono: 'fa-building-columns' }
  ];

  public apiUrl = environment.apiUrl;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/carrito']);
      return;
    }
    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    this.isLoadingDirecciones = true;
    const usuario = this.authService.getUserData();
    if (!usuario?.idUsuario) { this.isLoadingDirecciones = false; return; }

    const headers = this.getAuthHeaders();
    this.http.get<Direccion[]>(`${this.apiUrl}/direcciones/usuario/${usuario.idUsuario}`, { headers })
      .subscribe({
        next: (dirs) => {
          this.direcciones = dirs;
          if (dirs.length > 0) this.idDireccionSeleccionada = dirs[0].idDireccion;
          this.isLoadingDirecciones = false;
        },
        error: () => { this.isLoadingDirecciones = false; }
      });
  }

  get total(): number      { return this.cartService.getTotal(); }
  get totalItems(): number { return this.cartService.getCartCount(); }
  get direccionSeleccionada(): Direccion | undefined {
    return this.direcciones.find(d => d.idDireccion === this.idDireccionSeleccionada);
  }

  irPaso(paso: number): void { this.pasoActual = paso; this.errorMsg = ''; }
  puedeIrPaso2(): boolean    { return this.idDireccionSeleccionada !== null; }


  confirmarPedido(): void {
  if (!this.idDireccionSeleccionada) { this.errorMsg = 'Selecciona una dirección de envío.'; return; }

  const usuario = this.authService.getUserData();
  if (!usuario?.idUsuario) { this.errorMsg = 'Debes iniciar sesión para continuar.'; return; }

  this.isLoading = true;
  this.errorMsg = '';

  const pedidoDTO = {
    idUsuario:        usuario.idUsuario,
    idDireccionEnvio: this.idDireccionSeleccionada,
    total:            this.total,
    items: this.cartItems.map(item => ({
      idProducto:     item.product.idProducto,
      cantidad:       item.quantity,
      precioUnitario: item.product.precio
    }))
  };

  const headers   = this.getAuthHeaders();
  const idUsuario = usuario.idUsuario;

  this.http.post<any>(`${this.apiUrl}/pedidos`, pedidoDTO, { headers })
    .subscribe({
      next: (pedido) => {
        const realPedidoId = pedido.idPedido || pedido.id;

        if (this.metodoPago === 'TARJETA_CREDITO') {

          this.isLoading = false;

          // ✅ REDIRECCIÓN CORRECTA: Mandamos al usuario a TU componente de pago local
          this.router.navigate(['/pago', realPedidoId], {
  queryParams: { total: this.total }
});

        } else {
          // Flujo para otros métodos (PayPal / Transferencia)
          this.http.put<any>(
            `${this.apiUrl}/pedidos/${realPedidoId}/pagar?metodoPago=${this.metodoPago}`,
            {}, { headers }
          ).subscribe({
            next: (pedidoPagado) => {
              this.pedidoCreado = pedidoPagado;
              this.vaciarCarritoCompleto(idUsuario, headers);
              this.isLoading = false;
              this.pasoActual = 3;
            },
            error: () => {
              this.pedidoCreado = pedido;
              this.vaciarCarritoCompleto(idUsuario, headers);
              this.isLoading = false;
              this.pasoActual = 3;
            }
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al crear el pedido:', err);
        this.errorMsg = err?.error?.message || 'Error al crear el pedido. Intenta nuevamente.';
      }
    });
}

  private vaciarCarritoCompleto(idUsuario: number, headers: HttpHeaders): void {
    this.cartService.clearCart();
    this.http.delete(
      `${this.apiUrl}/carritos/usuario/${idUsuario}/vaciar`,
      { headers }
    ).subscribe({
      next: () => console.log('Carrito BD vaciado correctamente'),
      error: (err) => console.error('Error vaciando carrito en BD:', err)
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  irAMisPedidos(): void { this.router.navigate(['/mis-pedidos']); }
  irAlInicio(): void    { this.router.navigate(['/']); }
}
