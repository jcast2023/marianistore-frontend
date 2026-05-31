
export interface Categoria {
  idCategoria: number;
  nombre: string;
}


export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  fechaCreacion?: string | Date;
  categoria: Categoria;
}
