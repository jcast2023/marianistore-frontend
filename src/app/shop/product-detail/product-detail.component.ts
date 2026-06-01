import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id && !isNaN(id)) {
      this.loadProduct(id);
    } else {
      this.error = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.product = products.find(p => p.idProducto === id) || null;
        this.isLoading = false;
        if (!this.product) {
          this.error = 'Producto no encontrado';
        }
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.error = 'No se pudo cargar el producto';
        this.isLoading = false;
      }
    });
  }

  increaseQty(stock: number): void {
    if (this.quantity < stock) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {

    if (this.quantity > product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Cantidad no disponible',
        text: `Lo sentimos, solo quedan ${product.stock} unidades disponibles en stock.`,
        confirmButtonColor: '#2b4c3f'
      });
      return;
    }

    const success = this.cartService.addToCart(product, this.quantity);

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
        title: `${this.quantity} x ${product.nombre} añadido al carrito`
      });

      this.quantity = 1;
    }
  }
}
