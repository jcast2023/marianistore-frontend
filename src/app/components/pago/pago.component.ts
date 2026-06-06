import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../models/payment.model';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
 selector: 'app-pago',
 standalone: true,
 imports: [
   CommonModule,
   FormsModule,
   RouterModule
 ],
 templateUrl: './pago.component.html',
 styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

 idPedido!: number;

 procesando = false;

 pagoExitoso = false;

 metodoSeleccionado = 'TARJETA_CREDITO';

 totalPedido = 0;

 private apiUrl = environment.apiUrl;

 metodos: PaymentMethod[] = [

   {
     id:'TARJETA_CREDITO',
     name:'Tarjeta de Crédito',
     icon:'bi-credit-card',
     description:'Visa, Mastercard, Amex (Mercado Pago)'
   },

   {
     id:'PAYPAL',
     name:'PayPal',
     icon:'bi-paypal',
     description:'Pago rápido y seguro'
   },

   {
     id:'TRANSFERENCIA',
     name:'Transferencia',
     icon:'bi-bank',
     description:'Banca por internet'
   }

 ];

 constructor(

   private route: ActivatedRoute,

   private router: Router,

   private http: HttpClient,

   private pagoService: PagoService,

   private authService: AuthService,

   private cartService: CartService

 ){}

 ngOnInit(): void {

   const id = this.route.snapshot.paramMap.get('id');

   if(!id){

      this.router.navigate(['/']);

      return;

   }

   this.idPedido = Number(id);

   const totalQuery = this.route.snapshot.queryParamMap.get('total');

   if(totalQuery){

      this.totalPedido = Number(totalQuery);

   }

   if(
      !this.totalPedido ||
      this.totalPedido <= 0
   ){

      this.cargarTotalPedido();

   }

 }

 cargarTotalPedido(): void {

   const token = this.authService.getToken();

   const headers = new HttpHeaders({

      Authorization:`Bearer ${token}`

   });

   this.http.get<any>(
      `${this.apiUrl}/pedidos/${this.idPedido}`,
      {headers}
   ).subscribe({

      next:(pedido)=>{

         this.totalPedido = Number(

            pedido?.total ??

            pedido?.monto ??

            0

         );

      },

      error:(err)=>{

         console.error(err);

         Swal.fire(
            'Error',
            'No se pudo obtener información del pedido',
            'error'
         );

         this.router.navigate(['/mis-pedidos']);

      }

   });

 }

 confirmarPago(): void {

   if(this.procesando){

      return;

   }

   this.procesando = true;

   if(
      this.metodoSeleccionado ===
      'TARJETA_CREDITO'
   ){

      this.pagarConMercadoPago();

   }

   else{

      Swal.fire({

         title:'Procesando pago...',

         html:'<p>Verificando transacción...</p>',

         allowOutsideClick:false,

         showConfirmButton:false,

         timer:2000

      })

      .then(()=>{

         this.procesarPagoBackend();

      });

   }

 }

 pagarConMercadoPago(): void {

   if(
      !this.totalPedido ||
      this.totalPedido <=0
   ){

      Swal.fire(
         'Error',
         'Monto inválido',
         'error'
      );

      this.procesando=false;

      return;

   }

   const usuario = this.authService.getUserData();

   const token = this.authService.getToken();

   const headers = new HttpHeaders({

      Authorization:`Bearer ${token}`

   });

   Swal.fire({

      title:'Conectando con Mercado Pago',

      text:'Espere un momento...',

      allowOutsideClick:false,

      didOpen:()=>{

         Swal.showLoading();

      }

   });

   this.http.post<any>(

      `${this.apiUrl}/pagos/preferencia`,

      {

         pedidoId:this.idPedido,

         descripcion:'Compra Marianí Store',

         monto:this.totalPedido,

         email:

            usuario?.email ||

            'cliente@marianistore.com'

      },

      {headers}

   )

   .subscribe({

      next:(pref)=>{

         Swal.close();

         this.procesando=false;

         const url =

            pref?.sandboxUrl ||

            pref?.initPoint;

         if(url){

            window.location.href=url;

         }

         else{

            Swal.fire(
               'Error',
               'Mercado Pago no devolvió URL',
               'error'
            );

         }

      },

      error:(err)=>{

         console.error(err);

         this.procesando=false;

         Swal.fire(
            'Error',
            err?.error?.mensaje ||
            'No se pudo iniciar pago',
            'error'
         );

      }

   });

 }

 procesarPagoBackend(): void {

   this.pagoService

   .pagarPedido(

      this.idPedido,

      this.metodoSeleccionado

   )

   .subscribe({

      next:()=>{

         this.limpiarCarrito();

         Swal.fire(

            'Pago Exitoso',

            'Procesado correctamente',

            'success'

         ).then(()=>{

            this.router.navigate(
               ['/mis-pedidos']
            );

         });

      },

      error:(err)=>{

         this.procesando=false;

         Swal.fire(

            'Pago rechazado',

            err?.error?.mensaje ||

            'Error procesando pago',

            'error'

         );

      }

   });

 }

 limpiarCarrito(): void {

   const usuario=this.authService.getUserData();

   const token=this.authService.getToken();

   const headers=new HttpHeaders({

      Authorization:`Bearer ${token}`

   });

   this.cartService.clearCart();

   if(usuario?.idUsuario){

      this.http.delete(

         `${this.apiUrl}/carritos/usuario/${usuario.idUsuario}/vaciar`,

         {headers}

      )

      .subscribe();

   }

 }

 obtenerNombreMetodo(): string {

   const nombres:any={

      TARJETA_CREDITO:
      'Tarjeta Crédito',

      PAYPAL:
      'PayPal',

      TRANSFERENCIA:
      'Transferencia'

   };

   return nombres[this.metodoSeleccionado]
      || this.metodoSeleccionado;

 }

 bajarFactura(): void {

   this.pagoService
   .descargarFactura(
      this.idPedido
   )
   .subscribe({

      next:(blob)=>{

         const url=
            window.URL.createObjectURL(
               blob
            );

         const a=
            document.createElement(
               'a'
            );

         a.href=url;

         a.download=
            `factura_${this.idPedido}.pdf`;

         a.click();

         window.URL.revokeObjectURL(
            url
         );

      },

      error:()=>{

         Swal.fire(

            'Error',

            'No se pudo descargar factura',

            'error'

         );

      }

   });

 }

}
