import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../models/payment.model';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  idPedido!: number;
  procesando = false;
  pagoExitoso = false;
  metodoSeleccionado = 'TARJETA_CREDITO';
  totalPedido: number = 0;

  metodos: PaymentMethod[] = [
    {
      id: 'TARJETA_CREDITO',
      name: 'Tarjeta de Crédito',
      icon: 'bi-credit-card',
      description: 'Visa, Mastercard, Amex (Mercado Pago)'
    },
    {
      id: 'PAYPAL',
      name: 'PayPal',
      icon: 'bi-paypal',
      description: 'Pago rápido y seguro'
    },
    {
      id: 'TRANSFERENCIA',
      name: 'Transferencia',
      icon: 'bi-bank',
      description: 'Banca por internet'
    }
  ];

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pagoService: PagoService,
    private authService: AuthService,
    private router: Router

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPedido = +id;
      this.cargarTotalPedido();
    } else {
      this.router.navigate(['/']);
    }
  }

  cargarTotalPedido(): void {
    this.http.get<any>(`${this.apiUrl}/pedidos/${this.idPedido}`).subscribe({
      next: (pedido) => {
        this.totalPedido = pedido.total;

      },
      error: (err) => {
        console.error('Error al cargar pedido:', err);
      }
    });
  }

  confirmarPago(): void {
    if (this.procesando) return;
    this.procesando = true;

    if (this.metodoSeleccionado === 'TARJETA_CREDITO') {
      this.pagarConMercadoPago();
    } else {
      Swal.fire({
        title: 'Procesando pago...',
        html: '<p>Verificando transacción...</p>',
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        this.procesarPagoEnBackend();
      });
    }
  }


  pagarConMercadoPago(): void {
    const usuario = this.authService.getUserData();
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    Swal.fire({
      title: 'Redirigiendo a Mercado Pago...',
      text: 'Serás llevado al checkout seguro.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post<any>(`${this.apiUrl}/pagos/preferencia`, {
      pedidoId:    this.idPedido,
      descripcion: 'Compra en MarianíStore',
      monto:       this.totalPedido,
      email:       usuario?.email || 'cliente@marianistore.com'
    }, { headers }).subscribe({
      next: (preferencia) => {
      Swal.close();
      this.procesando = false;

      if (preferencia && preferencia.sandboxUrl) {
        console.log('URL de Mercado Pago generada:', preferencia.sandboxUrl);
        window.location.href = preferencia.sandboxUrl;
      } else {
        Swal.fire('Error', 'No se recibió la URL de redirección desde el servidor.', 'error');
      }
    },
    error: (err) => {
      this.procesando = false;
      console.error('Error en el backend al crear la preferencia:', err);
      Swal.fire('Error', err.error?.mensaje || 'No se pudo iniciar el pago con Mercado Pago.', 'error');
    }
  });
}

  procesarPagoEnBackend(): void {
    this.pagoService.pagarPedido(this.idPedido, this.metodoSeleccionado).subscribe({
      next: () => {
        Swal.fire('¡Pago Autorizado!', 'Procesado correctamente', 'success').then(() => {
          this.pagoExitoso = true;
          this.procesando  = false;
          this.router.navigate(['/mis-pedidos']);
        });
      },
      error: (err) => {
        Swal.fire('Pago Declinado', err.error?.mensaje || 'Error al procesar.', 'error');
        this.procesando = false;
      }
    });
  }

  obtenerNombreMetodo(): string {
    const nombres: Record<string, string> = {
      'TARJETA_CREDITO': 'Tarjeta de Crédito (Mercado Pago)',
      'PAYPAL':          'PayPal',
      'TRANSFERENCIA':   'Transferencia Bancaria'
    };
    return nombres[this.metodoSeleccionado] || this.metodoSeleccionado;
  }

  bajarFactura(): void {
    this.pagoService.descargarFactura(this.idPedido).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = `factura_${this.idPedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          toast:             true,
          position:          'top-end',
          icon:              'success',
          title:             'Descargando factura...',
          showConfirmButton: false,
          timer:             2000
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo generar la factura en este momento.', 'error');
      }
    });
  }
}
