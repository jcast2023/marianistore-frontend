import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ProductService, Product } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-stock.component.html'
})
export class AdminStockComponent implements OnInit {
  @ViewChild('closeBtn')     closeBtn!: ElementRef;
  @ViewChild('closeBtnEdit') closeBtnEdit!: ElementRef;

  productos: any[] = [];

  nuevoProducto = {
    nombre: '', descripcion: '', precio: 0, stock: 0, imagen: '', imagenHover: '', id_categoria: 0
  };

  productoEditando: any = {
    idProducto: null, nombre: '', descripcion: '',
    precio: 0, stock: 0, imagen: '', imagenHover: '', id_categoria: 0
  };

  constructor(private adminService: AdminService, public prodService: ProductService) {}

  ngOnInit(): void { this.cargarProductos(); }

  cargarProductos() {
    this.prodService.getAllProducts().subscribe((res: any[]) => {
      this.productos = res;
    });
  }

  getNombreCategoria(p: any): string {
    if (p.categoria && p.categoria.nombre) return p.categoria.nombre;
    const id = p.id_categoria || (p.categoria ? p.categoria.idCategoria : null);
    const nombres: { [key: number]: string } = {
      1: 'Belleza', 2: 'Hogar', 3: 'Juguetería',
      4: 'Tecnología', 5: 'Papelería', 6: 'Moda'
    };
    return nombres[Number(id)] || 'Sin Categoría';
  }

  // ── Crear producto ───────────────────────────────────────────
  guardarNuevoProducto() {
    const productoParaEnviar = {
      nombre:      this.nuevoProducto.nombre,
      descripcion: this.nuevoProducto.descripcion,
      precio:      Number(this.nuevoProducto.precio),
      stock:       Number(this.nuevoProducto.stock),
      imagen:      this.nuevoProducto.imagen,
      imagenHover: this.nuevoProducto.imagenHover || null,
      categoria:   { idCategoria: Number(this.nuevoProducto.id_categoria) }
    };

    this.prodService.createProduct(productoParaEnviar as any).subscribe({
      next: () => {
        Swal.fire({ title: '¡Creado!', icon: 'success', timer: 1500, showConfirmButton: false });
        this.cargarProductos();
        this.closeBtn.nativeElement.click();
        this.resetForm();
      },
      error: (err) => { console.error(err); Swal.fire('Error', 'No se pudo guardar.', 'error'); }
    });
  }

  // ── Abrir modal de edición ───────────────────────────────────
  abrirEditar(p: any) {
    this.productoEditando = {
      idProducto:  p.idProducto,
      nombre:      p.nombre,
      descripcion: p.descripcion,
      precio:      p.precio,
      stock:       p.stock,
      imagen:      p.imagen,
      imagenHover: p.imagenHover || '',
      id_categoria: p.categoria?.idCategoria || p.id_categoria || 0
    };
  }

  // ── Guardar edición ──────────────────────────────────────────
  guardarEdicion() {
    const productoParaEnviar = {
      nombre:      this.productoEditando.nombre,
      descripcion: this.productoEditando.descripcion,
      precio:      Number(this.productoEditando.precio),
      stock:       Number(this.productoEditando.stock),
      imagen:      this.productoEditando.imagen,
      imagenHover: this.productoEditando.imagenHover || null,
      categoria:   { idCategoria: Number(this.productoEditando.id_categoria) }
    };

    this.prodService.updateProduct(this.productoEditando.idProducto, productoParaEnviar as any).subscribe({
      next: () => {
        Swal.fire({ title: '¡Actualizado!', icon: 'success', timer: 1500, showConfirmButton: false });
        this.cargarProductos();
        this.closeBtnEdit.nativeElement.click();
      },
      error: (err) => { console.error(err); Swal.fire('Error', 'No se pudo actualizar.', 'error'); }
    });
  }

  // ── Eliminar ─────────────────────────────────────────────────
  eliminarProducto(id: any) {
    if (!id) return;
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción borrará el registro de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Producto borrado correctamente', 'success');
            this.cargarProductos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  // ── Actualizar solo stock ────────────────────────────────────
  actualizarStock(p: any) {
    Swal.fire({
      title: `Actualizar Stock: ${p.nombre}`,
      input: 'number',
      inputLabel: 'Cantidad actual: ' + p.stock,
      inputValue: p.stock,
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || Number(value) < 0) return '¡Debes ingresar una cantidad válida (0 o más)!';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoStock = Number(result.value);
        this.prodService.updateStock(p.idProducto, nuevoStock).subscribe({
          next: (res) => {
            p.stock = res.stock;
            Swal.fire({ title: '¡Actualizado!', icon: 'success', timer: 1500, showConfirmButton: false });
          },
          error: (err) => { console.error(err); Swal.fire('Error', 'No se pudo actualizar el stock.', 'error'); }
        });
      }
    });
  }

  resetForm() {
    this.nuevoProducto = { nombre: '', descripcion: '', precio: 0, stock: 0, imagen: '', imagenHover: '', id_categoria: 0 };
  }
}
