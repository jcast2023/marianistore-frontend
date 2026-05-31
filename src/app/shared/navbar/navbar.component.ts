import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string = '';
  isAdmin: boolean = false;
  private authSub?: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

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
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
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
          title: 'Has salido de TechShop'
        });

        this.router.navigate(['/login']);
      }
    });
  }
}
