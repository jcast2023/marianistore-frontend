import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


import { PaymentMethod } from '../../models/payment.model';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';


import { environment } from '../../../environments/environment';


@Component({
selector:'app-pago',
standalone:true,
imports:[
CommonModule,
FormsModule,
RouterModule
],
templateUrl:'./pago.component.html',
styleUrls:['./pago.component.css']
})
export class PagoComponent implements OnInit {


idPedido!:number;


procesando=false;


pagoExitoso=false;


metodoSeleccionado='TARJETA_CREDITO';


totalPedido=0;


private apiUrl=environment.apiUrl;


metodos:PaymentMethod[]=[


{
id:'TARJETA_CREDITO',
name:'Tarjeta de Crédito',
icon:'bi-credit-card',
description:'Visa, Mastercard'
},


{
id:'PAYPAL',
name:'PayPal',
icon:'bi-paypal',
description:'Pago rápido'
},


{
id:'TRANSFERENCIA',
name:'Transferencia',
icon:'bi-bank',
description:'Transferencia bancaria'
}


];


constructor(


private route:ActivatedRoute,


private router:Router,


private http:HttpClient,


private pagoService:PagoService,


private authService:AuthService,


private cartService:CartService


){}


ngOnInit():void{


const id=this.route.snapshot.paramMap.get('id');


if(!id){


this.router.navigate(['/']);


return;


}


this.idPedido = Number(id);


  // Opción B: obtener total real desde el backend
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });


  this.http.get<any>(`${this.apiUrl}/pedidos/${this.idPedido}`, { headers })
    .subscribe({
      next: (pedido) => {
        this.totalPedido = pedido.total ?? 0;
      },
      error: () => {
        this.totalPedido = 0;
      }
    });
}


confirmarPago():void{


if(this.procesando){


return;


}


this.procesando=true;


if(this.metodoSeleccionado==='TARJETA_CREDITO'){


this.pagarConMercadoPago();


}else{


this.procesarPagoBackend();


}


}


pagarConMercadoPago(): void {
  const usuario = this.authService.getUserData();
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });


  const nombreCompleto = usuario?.name || '';
  const partes = nombreCompleto.trim().split(' ');
  const nombre = partes[0] || '';
  const apellido = partes.slice(1).join(' ') || '';


  this.http.post<any>(
    `${this.apiUrl}/pagos/preferencia`,
    {
      pedidoId: this.idPedido,
      descripcion: 'Compra MarianiStore',
      monto: this.totalPedido,
      email: usuario?.email,
      nombre: nombre,
      apellido: apellido,
      identificationType: 'DNI',
      identificationNumber: '41574663'
    },
    { headers }
  )
  .subscribe({
    next: (pref) => {
      this.procesando = false;
      console.log("Respuesta de preferencia:", pref);


      // CAMBIO AQUÍ: Priorizamos la URL de Sandbox para las pruebas de certificación
      const url = pref.sandboxUrl || pref.initPoint;


      if (url) {
        window.location.href = url;
      } else {
        Swal.fire('Error', 'No llegó URL de MercadoPago', 'error');
      }
    },
    error: (err) => {
      console.error(err);
      this.procesando = false;
      Swal.fire('Error', 'No se pudo iniciar el pago', 'error');
    }
  });
}


procesarPagoBackend():void{


this.pagoService


.pagarPedido(


this.idPedido,


this.metodoSeleccionado


)


.subscribe({


next:()=>{


this.cartService.clearCart();


Swal.fire(


'Pago realizado',


'Compra completada',


'success'


).then(()=>{


this.router.navigate(


['/mis-pedidos']


);


});


},


error:()=>{


this.procesando=false;


Swal.fire(


'Error',


'No se pudo procesar',


'error'


);


}


});


}


bajarFactura():void{


this.pagoService


.descargarFactura(


this.idPedido


)


.subscribe(blob=>{


const url=


window.URL.createObjectURL(blob);


const a=document.createElement('a');


a.href=url;


a.download=`factura_${this.idPedido}.pdf`;


a.click();


window.URL.revokeObjectURL(url);


});


}


}
