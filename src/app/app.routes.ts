import { DashboardComponent } from './admin/dashboard/dashboard.component';

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductDetailComponent } from './shop/product-detail/product-detail.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { PagoComponent } from './components/pago/pago.component';
import { MyOrders } from './shop/my-orders/my-orders';
import { AdminStockComponent } from './admin/admin-stock/admin-stock.component';
import { adminGuard } from './guards/admin-guard';
import { AdminOrders } from './admin/admin-orders/admin-orders';
import { InfoComponent } from './shared/info/info.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductListComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mis-pedidos', component: MyOrders, canActivate: [authGuard] },
  { path: 'pago/:id', component: PagoComponent, canActivate: [authGuard] },

  { path: 'admin/stock', component: AdminStockComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/pedidos', component: AdminOrders, canActivate: [authGuard, adminGuard] },
  { path: 'ayuda', component: InfoComponent },
  { path: 'terminos', component: InfoComponent },
  { path: 'devoluciones', component: InfoComponent },
  { path: 'direcciones', component: DireccionesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
