import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../services/wishlist';
import { Product } from '../product';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  favoriteProducts: Product[] = [];
  private wishlistSub?: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((products: any[]) => {
      this.favoriteProducts = products;
    });
  }

  ngOnDestroy(): void {
    this.wishlistSub?.unsubscribe();
  }

  removeItem(product: Product): void {
    this.wishlistService.toggleWishlist(product);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Eliminado de tus favoritos',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

  addToCart(product: any): void {
    const idProducto = product.idProducto || product.id;
    const nombre = product.nombre || product.name;
    const precio = product.precio || product.price;
    const imagen = product.imagen || product.image;
    const stock = product.stock !== undefined ? product.stock : product.quantity;

    // 1. Armamos el objeto estructurado con las propiedades que espera tu CartService
    const productoAEmitir = {
      idProducto: idProducto,
      nombre: nombre,
      precio: precio,
      imagen: imagen,
      quantity: 1,
      stock: stock
    };

    // 2. Agregamos el ítem al carrito a través de tu servicio global

    this.cartService.addToCart(productoAEmitir);

    // 3. Lanzamos la notificación y esperamos a que termine para redirigir
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: '¡Añadido! Redirigiendo al carrito...',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    }).then(() => {
      // 4.  EFECTUAR REDIRECCIÓN: Viaja de inmediato a la vista de checkout del carrito
      this.router.navigate(['/carrito']);
    });
  }
}
