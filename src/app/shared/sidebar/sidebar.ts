import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Categoria } from '../../services/product.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  categories: Categoria[] = [];

  categoryIcons: { [key: string]: string } = {
    'belleza': 'fa-solid fa-wand-magic-sparkles',
    'papeleria': 'fa-solid fa-pen-nib',
    'hogar': 'fa-solid fa-house-laptop',
    'jugueteria': 'fa-solid fa-gamepad',
    'tecnologia': 'fa-solid fa-laptop-code',
    'moda': 'fa-solid fa-shirt'
  };

  priceRanges = [
    { label: 'Menos de S/. 50', min: 0, max: 50 },
    { label: 'S/. 50 - S/. 100', min: 50, max: 100 },
    { label: 'S/. 100 - S/. 500', min: 100, max: 500 },
    { label: 'S/. 500 - S/. 1000', min: 500, max: 1000 },
    { label: 'Más de S/. 1000', min: 1000, max: 999999 }
  ];

  constructor(
    public productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Error al cargar categorías en el sidebar:', err);
      }
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  filtrarPorPrecio(min: number, max: number): void {
    this.router.navigate(['/productos'], {
      queryParams: { minPrice: min, maxPrice: max },
      queryParamsHandling: 'merge'
    });
    this.closeSidebar();
  }


  getIcon(categoryName: string): string {
    if (!categoryName) return 'fa-solid fa-box';

    const normalized = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return this.categoryIcons[normalized] || 'fa-solid fa-box';
  }
}
