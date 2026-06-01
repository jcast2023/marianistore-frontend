import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CarouselSlide {
  image: string;
  title?: string;
  subtitle?: string;
  ruta?: string;
  categoria?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit, OnDestroy {

  slides: CarouselSlide[] = [
    { image: 'assets/productos/bannerms.jpeg', ruta: '/productos' },
    { image: 'assets/productos/carrusel1.webp', ruta: '/productos', categoria: 'Tecnología' },
    { image: 'assets/productos/carrousel2.webp', ruta: '/productos', categoria: 'Belleza' },
    { image: 'assets/productos/carrousel3.webp', ruta: '/productos', categoria: 'Hogar' },
    { image: 'assets/productos/carrousel4.webp', ruta: '/productos', categoria: 'Juguetería' },
    { image: 'assets/productos/carrousel5.webp', ruta: '/productos', categoria: 'Moda' },
    { image: 'assets/productos/carrousel6.webp', ruta: '/productos', categoria: 'Papelería' }
  ];

  currentSlide = 0;
  private autoSlideInterval: any;

  constructor() {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(false);
    }, 4000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  nextSlide(isManual: boolean = true): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    if (isManual) this.resetTimer();
  }


  prevSlide(isManual: boolean = true): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    if (isManual) this.resetTimer();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetTimer();
  }

  private resetTimer(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
