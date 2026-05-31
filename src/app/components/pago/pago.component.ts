import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../models/payment.model';
import { PagoService } from '../../services/pago.service';
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

  // ← MEJORA 2: Variable para guardar método seleccionado
  metodoSeleccionado = 'TARJETA_CREDITO'; // Cambiado de 'card' a 'TARJETA_CREDITO'

  // ← MEJORA 2: Actualizar valores de los métodos para que coincidan con el backend
  metodos: PaymentMethod[] = [
    {
      id: 'TARJETA_CREDITO', // ← Cambiado
      name: 'Tarjeta de Crédito',
      icon: 'bi-credit-card',
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'PAYPAL', // ← Cambiado
      name: 'PayPal',
      icon: 'bi-paypal',
      description: 'Pago rápido y seguro'
    },
    {
      id: 'TRANSFERENCIA', // ← Cambiado
      name: 'Transferencia',
      icon: 'bi-bank',
      description: 'Banca por internet'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pagoService: PagoService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPedido = +id;
    } else {
      this.router.navigate(['/']);
    }
  }

  confirmarPago() {
    if (this.procesando) return;
    this.procesando = true;

    // ← MEJORA 1: Agregar delay de procesamiento (2 segundos)
    Swal.fire({
      title: 'Procesando pago...',
      html: `
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Verificando con el banco...</p>
          <p class="text-muted small">ID de Pedido: ${this.idPedido}</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 2000 // ← 2 segundos de procesamiento
    }).then(() => {
      // Después de 2 segundos, procesar el pago real
      this.procesarPagoEnBackend();
    });
  }

  // ← MEJORA 1 y 2: Nuevo método que procesa el pago con el método seleccionado
  procesarPagoEnBackend() {
    // ← MEJORA 2: Enviar método de pago al backend
    this.pagoService.pagarPedido(this.idPedido, this.metodoSeleccionado).subscribe({
      next: () => {
        // ← MEJORA 3: Mostrar método de pago en la confirmación
        Swal.fire({
          title: '¡Pago Autorizado!',
          html: `
            <div class="text-center">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
              <p class="mt-3">Tu pedido ha sido procesado correctamente</p>
              <p class="text-muted small">Pedido #${this.idPedido}</p>
              <p class="text-muted small">
                <strong>Método:</strong> ${this.obtenerNombreMetodo()}
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#28a745',
          confirmButtonText: 'Ver comprobante'
        }).then(() => {
          this.pagoExitoso = true;
          this.procesando = false;
          this.router.navigate(['/mis-pedidos']);
        });
      },
      error: (err) => {
        const mensajeError = err.error?.mensaje || 'Error al procesar el pago.';
        console.error('Error:', mensajeError);

        Swal.fire({
          title: 'Pago Declinado',
          text: mensajeError,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        this.procesando = false;
      }
    });
  }

  // ← MEJORA 3: Método para obtener nombre legible del método de pago
  obtenerNombreMetodo(): string {
    const nombres: any = {
      'TARJETA_CREDITO': 'Tarjeta de Crédito',
      'PAYPAL': 'PayPal',
      'TRANSFERENCIA': 'Transferencia Bancaria'
    };
    return nombres[this.metodoSeleccionado] || this.metodoSeleccionado;
  }

  bajarFactura() {
    this.pagoService.descargarFactura(this.idPedido).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${this.idPedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Descargando factura...',
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo generar la factura en este momento.', 'error');
      }
    });
  }
}
