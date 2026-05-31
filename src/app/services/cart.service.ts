import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private storageKey = 'techshop_cart';

  constructor() { this.loadCart(); }

  private saveCart(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems.value));
  }

  private loadCart(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try { this.cartItems.next(JSON.parse(saved)); }
      catch (e) { this.cartItems.next([]); }
    }
  }

  addToCart(product: any, quantity: number = 1): boolean {
    const items = this.cartItems.value;


   const p: Product = {

    idProducto: product.idProducto || product.id_producto || product.id,
    nombre: product.nombre || product.name,
    precio: product.precio || product.price,

    stock: product.stock !== undefined ? Number(product.stock) : 99,
    imagen: product.imagen || '',
    descripcion: product.descripcion || '',
    categoria: product.categoria
  };

 if (!p.idProducto) {
    console.error('El producto no tiene ID válido:', product);
    return false;
  }

    const existingItem = items.find(i => i.product.idProducto === p.idProducto);
    if (existingItem) {
      if (existingItem.quantity + quantity > p.stock) {
        alert(`Solo quedan ${p.stock} unidades.`);
        return false;
      }
      existingItem.quantity += quantity;
    } else {
      items.push({ product: p, quantity });
    }

    this.cartItems.next([...items]);
    this.saveCart();
    return true;
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartItems.value;
    const item = items.find(i => i.product.idProducto === productId);
    if (item) {
      if (quantity > item.product.stock) {
        alert(`Máximo disponible: ${item.product.stock}`);
        return;
      }
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...items]);
        this.saveCart();
      }
    }
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems.value.filter(i => i.product.idProducto !== productId);
    this.cartItems.next(items);
    this.saveCart();
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotal(): number {
    return this.cartItems.value.reduce((acc, i) => acc + (i.product.precio * i.quantity), 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem(this.storageKey);
  }


getCartItems(): CartItem[] {
  return this.cartItems.value;
}
}
