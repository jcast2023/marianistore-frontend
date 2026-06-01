import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../shop/product';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {


  private wishlistItems = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistItems.asObservable();
  private storageKey = 'tiendaonline_wishlist';
  private apiUrl = 'http://localhost:8080/api/wishlist';

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  // ── localStorage ─────────────────────────────────────────────

  private saveWishlist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems.value));
  }

  private loadWishlist(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try { this.wishlistItems.next(JSON.parse(saved)); }
      catch (e) { this.wishlistItems.next([]); }
    }
  }

  // ── Toggle favorito (local + BD si está logueado) ─────────────

  toggleWishlist(product: any): boolean {
    const currentItems = this.wishlistItems.value;
    // ✅ Buscamos por idProducto o id por si acaso
    const productId = product.idProducto || product.id;

    if (!productId) {
      console.error('El producto no tiene un ID válido para favoritos:', product);
      return false;
    }

    const index = currentItems.findIndex(item => (item.idProducto || item.id) === productId);

    if (index >= 0) {
      // Quitar de favoritos
      currentItems.splice(index, 1);
      this.wishlistItems.next([...currentItems]);
      this.saveWishlist();

      // Sincronizar con BD si hay sesión
      const { token, idUsuario } = this.getSession();
      if (token && idUsuario) {
        this.eliminarFavoritoBD(idUsuario, productId, token);
      }
      return false;
    } else {
      // Agregar a favoritos
      currentItems.push(product);
      this.wishlistItems.next([...currentItems]);
      this.saveWishlist();

      // Sincronizar con BD si hay sesión
      const { token, idUsuario } = this.getSession();
      if (token && idUsuario) {
        this.agregarFavoritoBD(idUsuario, productId, token);
      }
      return true;
    }
  }

  isInWishlist(productId: number | undefined): boolean {
    if (!productId) return false;
    return this.wishlistItems.value.some(item => (item.idProducto || item.id) === productId);
  }

  getWishlistItems(): any[] { return this.wishlistItems.value; }
  getWishlistCount(): number    { return this.wishlistItems.value.length; }

  clearWishlist(): void {
    this.wishlistItems.next([]);
    localStorage.removeItem(this.storageKey);
  }

  // ── Sincronización con BD ─────────────────────────────────────

  sincronizarAlLogin(idUsuario: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const itemsLocales = this.wishlistItems.value;

    if (itemsLocales.length > 0) {
      const ids = itemsLocales
        .map(p => p.idProducto || p.id)
        .filter(id => id !== undefined) as number[];

      this.http.post(
        `${this.apiUrl}/usuario/${idUsuario}/sincronizar`, ids, { headers }
      ).subscribe({
        next: () => this.cargarDesdeDB(idUsuario, token),
        error: err => console.error('Error sincronizando wishlist:', err)
      });
    } else {
      this.cargarDesdeDB(idUsuario, token);
    }
  }

  limpiarAlLogout(): void {
    this.clearWishlist();
  }

  limpiarTodo(idUsuario: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(
      `${this.apiUrl}/usuario/${idUsuario}/limpiar`, { headers }
    ).subscribe({
      next: () => this.clearWishlist(),
      error: err => console.error('Error limpiando wishlist:', err)
    });
  }

  // ── Métodos privados BD ───────────────────────────────────────

  private cargarDesdeDB(idUsuario: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`, { headers })
      .subscribe({
        next: (itemsBD) => {
          if (itemsBD.length === 0) return;

          const productos = itemsBD.map(item => ({
            idProducto:  item.idProducto,
            id:          item.idProducto,
            nombre:      item.nombreProducto,
            precio:      item.precioProducto,
            stock:       item.stockProducto,
            imagen:      item.imagenProducto,
            imagenUrl:   item.imagenProducto,
            cantidad:    1,
            descripcion: '',
            categoria:   { idCategoria: 0, nombre: item.categoriaProducto || '' }
          }));

          this.wishlistItems.next(productos);
          this.saveWishlist();
        },
        error: err => console.error('Error cargando wishlist desde BD:', err)
      });
  }

  private agregarFavoritoBD(idUsuario: number, idProducto: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post(
      `${this.apiUrl}/usuario/${idUsuario}/producto/${idProducto}`, {}, { headers }
    ).subscribe({ error: err => console.error('Error agregando favorito a BD:', err) });
  }

  private eliminarFavoritoBD(idUsuario: number, idProducto: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(
      `${this.apiUrl}/usuario/${idUsuario}/producto/${idProducto}`, { headers }
    ).subscribe({ error: err => console.error('Error eliminando favorito de BD:', err) });
  }

  private getSession(): { token: string | null; idUsuario: number | null } {
    const token    = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    if (!token || !userData) return { token: null, idUsuario: null };
    try {
      const user = JSON.parse(userData);
      return { token, idUsuario: user?.idUsuario || null };
    } catch {
      return { token: null, idUsuario: null };
    }
  }
}
