import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5 pt-5" style="min-height: 70vh;">
      <div class="card border-0 shadow-sm p-5">
        <h1 class="fw-bold text-primary mb-4">{{ titulo }}</h1>
        <div class="info-content lead text-muted">
          {{ contenido }}
        </div>
        <hr class="my-4">
        <p class="small text-secondary">TechShop - Información Legal 2026</p>
      </div>
    </div>
  `
})
export class InfoComponent implements OnInit {
  titulo = '';
  contenido = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.url.subscribe(url => {
      const path = url[0].path;

      if (path === 'ayuda') {
        this.titulo = 'Centro de Ayuda';
        this.contenido = 'Bienvenido al soporte de TechShop. Aquí resolvemos tus dudas técnicas.';
      } else if (path === 'terminos') {
        this.titulo = 'Términos y Condiciones';
        this.contenido = 'Consulta nuestras políticas de uso, privacidad y seguridad de datos.';
      } else if (path === 'devoluciones') {
        this.titulo = 'Cambios y Devoluciones';
        this.contenido = 'Cuentas con un plazo de 30 días para reportar fallas en tus equipos.';
      }
    });
  }
}
