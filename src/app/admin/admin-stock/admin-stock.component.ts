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
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  productos: any[] = [];


  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '',
    id_categoria: 0
  };

  constructor(private adminService: AdminService, public prodService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.prodService.getAllProducts().subscribe((res: any[]) => {
      this.productos = res;
    });
  }

  getNombreCategoria(p: any): string {
    if (p.categoria && p.categoria.nombre) return p.categoria.nombre;

    const id = p.id_categoria || (p.categoria ? p.categoria.idCategoria : null);
    const nombres: { [key: number]: string } = {
      1: 'Laptops', 2: 'Celulares', 3: 'Accesorios', 7: 'Monitores'
    };
    return nombres[Number(id)] || 'Sin Categoría';
  }

  guardarNuevoProducto() {
  const productoParaEnviar = {
    nombre: this.nuevoProducto.nombre,
    descripcion: this.nuevoProducto.descripcion,
    precio: Number(this.nuevoProducto.precio),
    stock: Number(this.nuevoProducto.stock),
    imagen: this.nuevoProducto.imagen,

    categoria: {
      idCategoria: Number(this.nuevoProducto.id_categoria)
    }
  };

  this.prodService.createProduct(productoParaEnviar as any).subscribe({
    next: () => {
      Swal.fire({ title: '¡Creado!', icon: 'success', timer: 1500, showConfirmButton: false });
      this.cargarProductos();
      this.closeBtn.nativeElement.click();
      this.resetForm();
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar.', 'error');
    }
  });
}

  eliminarProducto(id: any) {
    if (!id) return;


    Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción borrará el registro de la base de datos.",
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

  resetForm() {
    this.nuevoProducto = { nombre: '', descripcion: '', precio: 0, stock: 0, imagen: '', id_categoria: 0 };
  }



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
      if (!value || Number(value) < 0) {
        return '¡Debes ingresar una cantidad válida (0 o más)!';
      }
      return null;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const nuevoStock = Number(result.value);

      this.prodService.updateStock(p.idProducto, nuevoStock).subscribe({
        next: (res) => {

          p.stock = res.stock;
          Swal.fire({
            title: '¡Actualizado!',
            text: 'El stock se actualizó correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el stock.', 'error');
        }
      });
    }
  });
}
}
