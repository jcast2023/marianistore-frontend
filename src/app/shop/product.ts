export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Product {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  imagenHover?: string;
  fechaCreacion?: string | Date;
  categoria?: Categoria | null;
}
