import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SidebarComponent } from '../sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string = '';
  isAdmin: boolean = false;
  searchTerm: string = '';
  cartCount: number = 0;
  wishlistCount: number = 0;

  private authSub?: Subscription;
  private cartSub?: Subscription;
  private wishlistSub?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public themeService: ThemeService
  ) {}

  cambiarTema(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit() {
    this.authSub = this.authService.authState$.subscribe((state: AuthState) => {
      if (state.isLoggedIn && state.user) {
        this.username = state.user.name || state.user.username || 'Usuario';
        this.isAdmin = this.authService.isAdmin;
      } else {
        this.username = '';
        this.isAdmin = false;
      }
    });


    this.cartSub = this.cartService.cartCount$.subscribe(count => {

      this.cartCount = count ? Number(count) : 0;
      console.log("Contador del carrito recibido en Navbar:", this.cartCount);
    });

    this.wishlistSub = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = items.length;
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.wishlistSub?.unsubscribe();
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos'], {
        queryParams: { search: this.searchTerm.trim() }
      });
      this.searchTerm = '';
    }
  }

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Tendrás que volver a ingresar para realizar compras.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.limpiarAlLogout();
        this.authService.logout();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });

        Toast.fire({
          icon: 'success',
          title: 'Has salido de tiendaonline'
        });

        this.router.navigate(['/login']);
      }
    });
  }
}
