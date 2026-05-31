import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CarouselComponent } from './carousel/carousel';
import { PromoBannerComponent } from './promo-banner/promo-banner';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselComponent, PromoBannerComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoading = true;
  allProducts: Product[] = [];

  // Secciones superiores fijas (Muestras de productos generales)
  productosGrilla: Product[] = [];
  productosDestacados: Product[] = [];

  // Contenedor dinámico por categorías para los bloques inferiores
  productsByCategory: { [key: string]: Product[] } = {};
  categories = ['Hogar', 'Belleza', 'Juguetería', 'Tecnología', 'Papelería', 'Moda'];

  // 💡 DICCIONARIO DE ICONOS PROFESIONALES (Font Awesome v6)
  categoryIcons: { [key: string]: string } = {
    'Belleza': 'fa-solid fa-wand-magic-sparkles',
    'Papelería': 'fa-solid fa-pen-nib',
    'Hogar': 'fa-solid fa-house-laptop',
    'Juguetería': 'fa-solid fa-gamepad',
    'Tecnología': 'fa-solid fa-laptop-code',
    'Moda': 'fa-solid fa-shirt'
  };

  constructor(
  public productService: ProductService,
  public cartService: CartService,      // <--- Cambia a public
  public wishlistService: WishlistService, // <--- Debe ser public
  public notificationService: NotificationService // <--- Debe ser public
) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;


        this.productosGrilla = products.slice(0, 4);
        this.productosDestacados = products.slice(4, 6);


        this.groupProductsByCategory(products);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos en la Home:', err);
        this.isLoading = false;
      }
    });
  }

  agregarAlCarrito(product: Product): void {
    const agregado = this.cartService.addToCart(product, 1);
    if (agregado) {
      this.notificationService.showToast(`¡${product.nombre} añadido al carrito!`, 'success');
  }
}

  alternarFavorito(product: Product): void {
  const agregado = this.wishlistService.toggleWishlist(product);
  const msg = agregado ? 'añadido a favoritos' : 'eliminado de favoritos';
  this.notificationService.showToast(`Producto ${msg}`, 'wishlist');
}

  groupProductsByCategory(products: Product[]): void {
    this.productsByCategory = {};
    this.categories.forEach(cat => {
      this.productsByCategory[cat] = products.filter(p =>
        p.categoria?.nombre.toLowerCase() === cat.toLowerCase()
      );
    });
  }

  getCategoryIcon(categoryName: string): string {
    return this.categoryIcons[categoryName] || 'fa-solid fa-box';
  }
}
