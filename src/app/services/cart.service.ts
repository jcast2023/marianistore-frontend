import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  idItem?: number;
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  // ✅ Stream numérico reactivo exclusivo para oyentes rápidos (Navbar burbuja)
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private storageKey  = 'tiendaonline_cart';
  private apiUrl      = 'http://localhost:8080/api/carritos';
  private productoUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  // ── localStorage ─────────────────────────────────────────────

  private saveCart(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems.value));
    this.cartCount.next(this.getCartCount());
  }

  private loadCart(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.cartItems.next(parsed);
        this.cartCount.next(this.getCartCount());
      }
      catch (e) {
        this.cartItems.next([]);
        this.cartCount.next(0);
      }
    }
  }

  // ── Operaciones locales ───────────────────────────────────────

  addToCart(product: any, quantity: number = 1): boolean {
    const items = this.cartItems.value;

    if (!product) {
      console.error('No se proporcionó un objeto producto válido.');
      return false;
    }

    //  Extracción defensiva inteligente: Soporta catálogo, Wishlist y objetos anidados
    const idProd = product.idProducto || product.id_producto || product.id || product.product?.idProducto;
    const nomProd = product.nombre || product.nombreProducto || product.name || product.product?.nombre || 'Producto sin nombre';
    const precProd = product.precio || product.precioProducto || product.price || product.product?.precio || 0;

    //  CORREGIDO: Forzar el parseo numérico del stock inmediatamente para evitar errores de comparación string vs number
    const rawStock = product.stock !== undefined ? product.stock : (product.product?.stock !== undefined ? product.product.stock : 99);
    const stockProd = Number(rawStock);

    const imgProd = product.imagen || product.imagenUrl || product.imagenProducto || product.product?.imagen || '';
    const descProd = product.descripcion || product.product?.descripcion || '';
    const catProd = product.categoria || product.product?.categoria || { nombre: 'General' };

    const p: Product = {
      idProducto:  idProd,
      nombre:      nomProd,
      precio:      Number(precProd),
      stock:       stockProd,
      imagen:      imgProd,
      descripcion: descProd,
      categoria:   catProd
    };

    if (!p.idProducto) {
      console.error('Imposible agregar al carrito. Producto sin ID identificable:', product);
      return false;
    }

    const seguroQuantity = Number(quantity) || 1;
    const existingItem = items.find(i => i.product && i.product.idProducto === p.idProducto);

    if (existingItem) {
      if (existingItem.quantity + seguroQuantity > p.stock) {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Stock insuficiente',
            text: `Solo quedan ${p.stock} unidades disponibles de este producto.`,
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#2b4c3f'
          });
        });
        return false;
      }
      existingItem.quantity += seguroQuantity;
      (existingItem as any).cantidad = existingItem.quantity;
    } else {

      const nuevoItem: CartItem = {
        product: p,
        quantity: seguroQuantity
      };

      // Mapeos planos de retrocompatibilidad
      (nuevoItem as any).cantidad = seguroQuantity;
      (nuevoItem as any).idProducto = p.idProducto;
      (nuevoItem as any).nombre = p.nombre;
      (nuevoItem as any).precio = p.precio;
      (nuevoItem as any).imagenUrl = p.imagen;
      (nuevoItem as any).stock = p.stock;

      items.push(nuevoItem);
    }

    this.cartItems.next([...items]);
    this.saveCart();

    const token    = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user?.idUsuario) this.agregarItemBD(user.idUsuario, p.idProducto, seguroQuantity, token);
      } catch (e) {}
    }

    return true;
  }

  updateQuantity(productId: number | undefined, quantity: number): void {
    //  CORREGIDO: Cláusula de guarda explícita para asegurar que el ID no sea null/undefined
    if (productId === undefined || productId === null) return;

    const items = this.cartItems.value;
    const item  = items.find(i => i.product && i.product.idProducto === productId);
    if (!item) return;

    if (quantity > (item.product.stock || 0)) {
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `El máximo disponible es ${item!.product.stock} unidades.`,
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#2b4c3f'
        });
      });
      return;
    }

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    item.quantity = quantity;
    (item as any).cantidad = quantity;

    this.cartItems.next([...items]);
    this.saveCart();

    const token = localStorage.getItem('access_token');
    if (token && item.idItem) this.actualizarItemBD(item.idItem, quantity, token);
  }

  removeFromCart(productId: number | undefined): void {
    // CORREGIDO: Cláusula de guarda para evitar romper las firmas de métodos backend
    if (productId === undefined || productId === null) return;

    const item  = this.cartItems.value.find(i => i.product && i.product.idProducto === productId);
    const token = localStorage.getItem('access_token');
    if (token && item?.idItem) this.eliminarItemBD(item.idItem, token);

    this.cartItems.next(this.cartItems.value.filter(i => i.product && i.product.idProducto !== productId));
    this.saveCart();
  }

  getCartCount(): number     { return this.cartItems.value.reduce((a, i) => a + (i.quantity || 0), 0); }
  getTotal(): number         { return this.cartItems.value.reduce((a, i) => a + ((i.product?.precio || 0) * (i.quantity || 0)), 0); }
  getCartItems(): CartItem[] { return this.cartItems.value; }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem(this.storageKey);
    this.cartCount.next(0);
  }

  // ── Sincronización con BD ─────────────────────────────────────

  sincronizarAlLogin(idUsuario: number, token: string): void {
    const headers      = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const itemsLocales = this.cartItems.value;

    if (itemsLocales.length > 0) {
      const payload = itemsLocales.map(i => ({
        idProducto: i.product?.idProducto,
        cantidad:   i.quantity
      }));
      this.http.post(`${this.apiUrl}/usuario/${idUsuario}/sincronizar`, payload, { headers })
        .subscribe({
          next:  () => this.cargarDesdeDB(idUsuario, token),
          error: (err) => console.error('Error sincronizando:', err)
        });
    } else {
      this.cargarDesdeDB(idUsuario, token);
    }
  }

  limpiarAlLogout(): void { this.clearCart(); }

  // ── Carga desde BD con datos completos de producto ───────────

  private cargarDesdeDB(idUsuario: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}/items`, { headers })
      .subscribe({
        next: (itemsBD) => {
          if (!itemsBD || itemsBD.length === 0) {
            this.clearCart();
            return;
          }

          const peticiones = itemsBD.map(itemBD =>
            this.http.get<Product>(`${this.productoUrl}/${itemBD.idProducto}`).pipe(
              catchError((err) => {
                console.warn(`El producto con ID ${itemBD.idProducto} no existe en el catálogo:`, err);
                return of(null);
              }),
              map(producto => {
                if (!producto || !producto.idProducto) return null;

                const precioNumerico = Number(producto.precio || 0);
                const cantidadNumerica = Number(itemBD.cantidad || 1);

                return {
                  idItem:   itemBD.idItem,
                  product:  {
                    ...producto,
                    precio: precioNumerico,
                    stock: Number(producto.stock || 0)
                  },
                  quantity: cantidadNumerica,
                  cantidad: cantidadNumerica,
                  idProducto: producto.idProducto,
                  nombre:   producto.nombre || 'Producto sin nombre',
                  precio:   precioNumerico,
                  imagenUrl: producto.imagen || '',
                  stock:    Number(producto.stock || 0)
                } as any;
              })
            )
          );

          forkJoin(peticiones).subscribe({
            next: (results) => {
              const itemsCompletos = results.filter(r => r !== null) as CartItem[];
              this.cartItems.next(itemsCompletos);
              this.saveCart();
            },
            error: (err) => console.error('Error crítico en forkJoin al cargar productos:', err)
          });
        },
        error: (err) => console.error('Error cargando carrito desde BD:', err)
      });
  }

  // ── Métodos privados BD ───────────────────────────────────────

  private agregarItemBD(idUsuario: number, idProducto: number, cantidad: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post<any>(`${this.apiUrl}/usuario/${idUsuario}/items`, { idProducto, cantidad }, { headers })
      .subscribe({
        next: (itemBD) => {
          const items = this.cartItems.value;
          const item  = items.find(i => i.product && i.product.idProducto === idProducto);
          if (item) {
            item.idItem = itemBD.idItem;
            this.cartItems.next([...items]);
            this.saveCart();
          }
        },
        error: (err) => console.error('Error Helium DB:', err)
      });
  }

  private actualizarItemBD(idItem: number, cantidad: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.put(`${this.apiUrl}/items/${idItem}`, { cantidad }, { headers })
      .subscribe({ error: (err) => console.error('Error actualizando item:', err) });
  }

  private eliminarItemBD(idItem: number, token: string): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.delete(`${this.apiUrl}/items/${idItem}`, { headers })
      .subscribe({ error: (err) => console.error('Error eliminando item:', err) });
  }
}
