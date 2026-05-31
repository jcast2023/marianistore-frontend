import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe({
      next: (params) => {
        const categoriaUrl = params['cat'];
        this.loadProducts(categoriaUrl);
      },
      error: (err) => {
        console.error("Error en parámetros de ruta:", err);
        this.loadProducts();
      }
    });
  }

  loadProducts(categoriaFiltro?: string): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Datos recibidos del servidor:', products);
        this.products = products;


        if (categoriaFiltro) {
          this.filteredProducts = products.filter(p =>
            p.categoria && p.categoria.nombre === categoriaFiltro
          );
        } else {
          this.filteredProducts = [...products];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos desde el Backend:', err);
        this.error = 'No se pudieron cargar los productos. Intenta más tarde.';
        this.isLoading = false;
      }
    });
  }



  searchProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(term) ||
      product.descripcion.toLowerCase().includes(term)
    );
  }

  addToCart(product: Product) {
    const success = this.cartService.addToCart(product, 1);
    if (success) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });

      Toast.fire({
        icon: 'success',
        title: `${product.nombre} añadido al carrito`
      });
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/producto', productId]);
  }
}
