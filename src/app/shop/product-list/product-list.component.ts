import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';

  categories: string[] = [];
  selectedCategory = '';
  selectedPrice = '';
  onlyInStock = false;
  sortBy = '';
  viewMode = 'grid';

  private urlMinPrice: number | null = null;
  private urlMaxPrice: number | null = null;

  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  pagesArray: number[] = [];

  priceRanges = [
    { label: 'Menos de S/. 50', min: 0, max: 50 },
    { label: 'S/. 50 - S/. 100', min: 50, max: 100 },
    { label: 'S/. 100 - S/. 500', min: 100, max: 500 },
    { label: 'S/. 500 - S/. 1000', min: 500, max: 1000 },
    { label: 'Más de S/. 1000', min: 1000, max: 999999 }
  ];

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map(c => c.nombre);
      },
      error: (err) => {
        console.error('Error al cargar categorías desde el backend:', err);
      }
    });

    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.listenToQueryParams();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  private listenToQueryParams(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.selectedCategory = params['cat'] || '';
        this.searchTerm = params['search'] || '';

        if (params['minPrice'] !== undefined && params['maxPrice'] !== undefined) {
          this.urlMinPrice = Number(params['minPrice']);
          this.urlMaxPrice = Number(params['maxPrice']);

          const foundRange = this.priceRanges.find(r => r.min === this.urlMinPrice && r.max === this.urlMaxPrice);
          this.selectedPrice = foundRange ? foundRange.label : '';
        } else {
          this.urlMinPrice = null;
          this.urlMaxPrice = null;
          this.selectedPrice = '';
        }

        this.applyFilters();
      },
      error: (err) => {
        console.error("Error procesando parámetros del sidebar/navbar:", err);
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let result = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      result = result.filter(p => p.categoria?.nombre === this.selectedCategory);
    }

    if (this.urlMinPrice !== null && this.urlMaxPrice !== null) {
      result = result.filter(p => p.precio >= this.urlMinPrice! && p.precio <= this.urlMaxPrice!);
    } else if (this.selectedPrice) {
      const range = this.priceRanges.find(r => r.label === this.selectedPrice);
      if (range) {
        result = result.filter(p => p.precio >= range.min && p.precio <= range.max);
      }
    }

    if (this.onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (this.sortBy === 'price-asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (this.sortBy === 'price-desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (this.sortBy === 'name-asc') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.sortBy === 'name-desc') {
      result.sort((a, b) => b.nombre.localeCompare(b.nombre));
    }

    this.filteredProducts = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onLocalPriceFilterChange(): void {
    if (this.selectedPrice) {
      const range = this.priceRanges.find(r => r.label === this.selectedPrice);
      if (range) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { minPrice: range.min, maxPrice: range.max },
          queryParamsHandling: 'merge'
        });
        return;
      }
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { minPrice: null, maxPrice: null },
      queryParamsHandling: 'merge'
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  searchProducts(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPrice = '';
    this.onlyInStock = false;
    this.sortBy = '';
    this.urlMinPrice = null;
    this.urlMaxPrice = null;
    this.router.navigate(['/productos']);
  }

  addToCart(product: Product) {
    const success = this.cartService.addToCart(product, 1);
    if (success) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'success',
        title: '¡Añadido al carrito!',
        text: `${product.nombre} se agregó correctamente.`,
        iconColor: '#2b4c3f',
        customClass: {
          popup: 'custom-toast-popup',
          title: 'custom-toast-title'
        }
      });
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/producto', productId]);
  }

  toggleFavorite(product: Product): void {
    if (product.stock === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Producto agotado',
        text: 'No puedes añadir a tus favoritos un producto sin stock disponible.',
        confirmButtonColor: '#2b4c3f'
      });
      return;
    }

    const esAgregado = this.wishlistService.toggleWishlist(product);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    if (esAgregado) {
      Toast.fire({
        icon: 'success',
        title: '¡Lista de Deseos!',
        text: `¡${product.nombre} añadido correctamente!`,
        iconColor: '#2b4c3f',
        customClass: {
          popup: 'custom-toast-popup',
          title: 'custom-toast-title'
        }
      });
    } else {
      Toast.fire({
        icon: 'info',
        title: 'Lista de Deseos',
        text: `Eliminado: ${product.nombre}`,
        customClass: {
          popup: 'custom-toast-popup',
          title: 'custom-toast-title'
        }
      });
    }
  }

  isProductInWishlist(productId: number | undefined): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
