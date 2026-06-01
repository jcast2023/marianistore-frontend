import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  idUsuario?: number;
  name?: string;
  username?: string;
  email: string;
  authorities?: string[];
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY  = 'user_data';
  private redirectUrl: string | null = null;

  private cartService     = inject(CartService);
  private wishlistService = inject(WishlistService);

  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: !!localStorage.getItem(this.USER_KEY),
    user: JSON.parse(localStorage.getItem(this.USER_KEY) || 'null')
  });

  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null { return this.authState.value.user; }
  get isAdmin(): boolean {
    const user = this.authState.value.user;
    return !!(user?.authorities?.includes('ADMIN') || user?.authorities?.includes('ROLE_ADMIN'));
  }
  get isLoggedIn(): boolean { return this.authState.value.isLoggedIn; }

  getUserData(): User | null { return this.authState.value.user; }
  getToken(): string | null  { return localStorage.getItem(this.TOKEN_KEY); }

  setRedirectUrl(url: string): void { this.redirectUrl = url; }
  getAndClearRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      { email: credentials.email, password: credentials.password },
      { headers }
    ).pipe(
      tap(res => {
        if (res.token) {
          const user = this.decodeToken(res.token);
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.authState.next({ isLoggedIn: true, user });

          if (user.idUsuario) {
            // Sincronizar carrito localStorage → BD
            this.cartService.sincronizarAlLogin(user.idUsuario, res.token);
            // Sincronizar wishlist localStorage → BD ← NUEVO
            this.wishlistService.sincronizarAlLogin(user.idUsuario, res.token);
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.clear();
    this.cartService.limpiarAlLogout();
    this.wishlistService.limpiarAlLogout();
    this.authState.next({ isLoggedIn: false, user: null });
    this.router.navigate(['/login']);
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload);
      return {
        id:          payload.idUsuario || payload.sub || payload.id,
        idUsuario:   payload.idUsuario || payload.sub,
        name:        payload.nombre    || payload.name || payload.username,
        email:       payload.sub       || payload.email,
        authorities: payload.roles     || payload.authorities || []
      };
    } catch (e) {
      console.error('Error decodificando token:', e);
      return { email: '', authorities: [] };
    }
  }
}
