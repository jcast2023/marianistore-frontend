import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReclamoService } from '../services/reclamo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-libro-reclamaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libro-reclamaciones.html',
  styleUrls: ['./libro-reclamaciones.css']
})
export class LibroReclamacionesComponent {
  reclamoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reclamoService: ReclamoService,
    private router: Router
  ) {
    this.reclamoForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numDocumento: ['', [Validators.required]],
      esMenor: ['No', [Validators.required]],
      direccion: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      provincia: ['Lima', [Validators.required]],
      departamento: ['Lima', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      tipoBien: ['Producto', [Validators.required]],
      montoReclamado: ['', [Validators.required, Validators.min(0.1)]],
      pedido: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      quejaReclamo: ['Reclamo', [Validators.required]],
      detalle: ['', [Validators.required]],
      pedidoConsumidor: ['', [Validators.required]]
    });
  }

  enviarReclamo() {
    if (this.reclamoForm.valid) {
      Swal.fire({
        title: 'Procesando Reclamación...',
        text: 'Por favor, espere un momento.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.reclamoService.registrarReclamo(this.reclamoForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Reclamo Registrado con Éxito!',
            html: `Su código de seguimiento es: <strong class="text-success">${response.codigoReclamo}</strong>.<br><br>Se ha enviado una copia detallada a <strong>${response.email}</strong>. Conforme a ley, resolveremos su caso en un plazo máximo de 15 días hábiles.`,
            confirmButtonColor: '#03291c'
          }).then(() => {
            this.reclamoForm.reset({ esMenor: 'No', provincia: 'Lima', departamento: 'Lima' });
            this.router.navigate(['/home']);
          });
        },
        error: (err) => {
          console.error('Error al guardar reclamo:', err);
          Swal.fire({
            icon: 'error',
            title: 'Hubo un inconveniente',
            text: err.error?.message || 'No se pudo conectar con el servidor. Inténtelo más tarde.',
            confirmButtonColor: '#c53030'
          });
        }
      });
    } else {
      this.reclamoForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor, rellene todos los campos requeridos con asterisco (*).',
        confirmButtonColor: '#c53030'
      });
    }
  }
}
