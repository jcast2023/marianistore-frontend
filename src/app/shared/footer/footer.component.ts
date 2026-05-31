import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  emailNewsletter: string = '';

  constructor(private newsletterService: NewsletterService) {}

  suscribir() {
    if (this.emailNewsletter && this.emailNewsletter.includes('@')) {
      this.newsletterService.registrarCorreo(this.emailNewsletter).subscribe({
        next: (res) => {

          Swal.fire({
            title: '¡Suscrito!',
            text: 'Hemos registrado tu correo con éxito.',
            icon: 'success',
            confirmButtonColor: '#0d6efd'
          });
          this.emailNewsletter = '';
        },
        error: (err) => {
          console.error('Error en suscripción:', err);

          Swal.fire({
            title: 'Error',
            text: 'Este correo ya existe o el servidor no responde.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    } else {
      Swal.fire('Atención', 'Por favor, ingresa un correo válido.', 'warning');
    }
  }
}
