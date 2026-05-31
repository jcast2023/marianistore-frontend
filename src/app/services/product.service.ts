import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Product {
  idProducto?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: Categoria;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient,

  ) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductImageUrl(imagen: string): string {
    if (!imagen || imagen === 'img') return 'assets/p1.jpg';
    return imagen.startsWith('http') ? imagen : `assets/productos/${imagen}`;
  }

  updateStock(id: number, nuevoStock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/stock`, { stock: nuevoStock });
  }

  getTop5Vendidos(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top5`);
  }
}
