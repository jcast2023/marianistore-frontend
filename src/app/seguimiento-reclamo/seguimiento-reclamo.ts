import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReclamoService } from '../services/reclamo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento-reclamo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './seguimiento-reclamo.html',
  styleUrls: ['./seguimiento-reclamo.css']
})
export class SeguimientoReclamoComponent {
  codigoBusqueda: string = '';
  reclamoEncontrado: any = null;
  buscado: boolean = false;

  constructor(private reclamoService: ReclamoService) {}

  buscarReclamo() {
    if (!this.codigoBusqueda.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, ingrese un código de reclamación válido.',
        confirmButtonColor: '#dd6b20'
      });
      return;
    }

    this.reclamoService.consultarSeguimiento(this.codigoBusqueda.trim().toUpperCase()).subscribe({
      next: (data: any) => {
        this.reclamoEncontrado = data;
        this.buscado = true;
      },
      error: (err: any) => {
        this.reclamoEncontrado = null;
        this.buscado = true;
        Swal.fire({
          icon: 'error',
          title: 'No encontrado',
          text: 'El código ingresado no coincide con ningún reclamo registrado.',
          confirmButtonColor: '#c53030'
        });
      }
    });
  }
}
