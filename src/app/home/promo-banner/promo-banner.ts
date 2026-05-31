import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-banner.html',
  styleUrl: './promo-banner.css'
})
export class PromoBannerComponent {
  promos = [
    { title: '10 CUOTAS',     subtitle: 'sin intereses',                  icon: '💳' },
    { title: 'ENVÍO GRATIS',  subtitle: 'en compras mayores a S/. 100',   icon: '🚚' },
    { title: 'DEVOLUCIÓN',    subtitle: '30 días garantizado',             icon: '↩️' },
    { title: 'OFERTAS FLASH', subtitle: 'Hasta 50% descuento',            icon: '⚡' },
    { title: 'PAGO SEGURO',   subtitle: 'Visa, Mastercard y más',         icon: '🔒' }
  ];
}
