import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid) return;

    const credentials = this.form.value as any;


    Swal.fire({
      title: 'Validando...',
      didOpen: () => { Swal.showLoading(); }
    });

    this.authService.login(credentials).subscribe({
      next: () => {
        Swal.close();


        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '¡Bienvenido a TechShop!',
          showConfirmButton: false,
          timer: 2000
        });

        const targetUrl = this.authService.getAndClearRedirectUrl() || '/';
        this.router.navigateByUrl(targetUrl);
      },
      error: (err: any) => {

        Swal.fire({
          title: 'Acceso Denegado',
          text: err.error?.message || 'Correo o contraseña incorrectos.',
          icon: 'error',
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    });
  }
}
