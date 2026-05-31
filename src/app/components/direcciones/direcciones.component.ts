import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common'; // Pasarela nativa para manejar historial
import Swal from 'sweetalert2';

interface Direccion {
  idDireccion?: number;
  idUsuario?: number;
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {
  direcciones: Direccion[] = [];
  formDireccion: FormGroup;
  editando = false;
  idDireccionEditando: number | null = null;
  loading = false;

  private apiUrl = 'http://localhost:8080/api/direcciones';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private location: Location
  ) {
    this.formDireccion = this.fb.group({
      calle: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
      pais: ['Perú', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    this.loading = true;
    const userId = this.authService.currentUser?.id || this.authService.currentUser?.idUsuario;

    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el usuario', 'error');
      this.loading = false;
      return;
    }

    this.http.get<Direccion[]>(`${this.apiUrl}/usuario/${userId}`).subscribe({
      next: (data) => {
        this.direcciones = data;
        this.loading = false;
        console.log('✅ Direcciones cargadas:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar direcciones:', err);
        Swal.fire('Error', 'No se pudieron cargar las direcciones', 'error');
        this.loading = false;
      }
    });
  }

  agregarOEditarDireccion(): void {
    if (this.formDireccion.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    const userId = this.authService.currentUser?.id || this.authService.currentUser?.idUsuario;
    const direccionData: Direccion = {
      ...this.formDireccion.value,
      idUsuario: userId
    };

    if (this.editando && this.idDireccionEditando) {
      // ── Actualizar Dirección existente ──
      this.http.put(`${this.apiUrl}/${this.idDireccionEditando}`, direccionData).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Actualizada!',
            text: 'La dirección ha sido actualizada correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.location.back();
          });
          this.cargarDirecciones();
          this.cancelarEdicion();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar la dirección', 'error');
        }
      });
    } else {
      // ── Crear Nueva Dirección ──
      this.http.post(this.apiUrl, direccionData).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Guardada!',
            text: 'La dirección ha sido agregada correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.location.back();
          });
          this.cargarDirecciones();
          this.formDireccion.reset({ pais: 'Perú' });
        },
        error: (err) => {
          console.error('Error al crear:', err);
          Swal.fire('Error', 'No se pudo agregar la dirección', 'error');
        }
      });
    }
  }

  editarDireccion(direccion: Direccion): void {
    this.editando = true;
    this.idDireccionEditando = direccion.idDireccion!;
    this.formDireccion.patchValue({
      calle: direccion.calle,
      ciudad: direccion.ciudad,
      estado: direccion.estado,
      codigoPostal: direccion.codigoPostal,
      pais: direccion.pais
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarDireccion(id: number): void {
    Swal.fire({
      title: '¿Eliminar dirección?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminada!',
              text: 'La dirección ha sido eliminada correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarDirecciones();
          },
          error: (err) => {
            console.error('❌ Error al eliminar:', err);
            let titulo = 'No se puede eliminar';
            let mensaje = 'Ocurrió un error al intentar eliminar la dirección';

            if (err.status === 409) {
              titulo = 'Dirección en uso';
              mensaje = err.error?.message ||
                       'No puedes eliminar esta dirección porque tienes pedidos asociados a ella.';
            } else if (err.status === 404) {
              titulo = 'Dirección no encontrada';
              mensaje = 'La dirección no existe o ya fue eliminada';
            }

            Swal.fire({
              title: titulo,
              html: `<p>${mensaje}</p>`,
              icon: 'error',
              confirmButtonText: 'Entendido',
              confirmButtonColor: '#3085d6'
            });
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.idDireccionEditando = null;
    this.formDireccion.reset({ pais: 'Perú' });
  }
}
