import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { InformacionCompraDTO } from '../../dto/compra/informacion-compra-dto';
import { ActivatedRoute } from '@angular/router';
import { DetalleCompraService } from '../../servicios/detalle-compra.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.css'
})
export class DetalleCompraComponent {
  compra: InformacionCompraDTO;
  isAutorizado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private detalleCompraService: DetalleCompraService,
    private tokenService: TokenService
  ) {
    this.compra = {
      id: '',
      idUsuario: '',
      informacionItemCompraDTOS: [],
      total: 0,
      fechaCompra: '',
      codigoCupon: '',
      estadoCompra: '',
      codigoPasarela: '',
      pago: null
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idCompra = params['id'];
      this.obtenerCompra(idCompra);
    });
  }

  obtenerCompra(idOrden: string): void {
    this.detalleCompraService.obtenerCompra(idOrden).subscribe({
      next: (compra) => {
        // Si la respuesta es exitosa, asignamos la compra
        this.compra = compra.respuesta;
        if(this.isCliente() && this.tokenService.getIDCuenta() === this.compra.idUsuario){
          this.isAutorizado = true;
        }
      },
      error: (err) => {
        // En caso de error al obtener la compra, mostramos un mensaje
        console.error('Error al obtener la compra:', err);
      }
    });
  }
  isLogged(){
    return this.tokenService.isLogged();
  }
  isCliente() {
    if (this.isLogged() && this.tokenService.getRol() === 'CLIENTE') {
      return true;
    }
    return false;
  }
  isPendiente(){
    if(this.compra.id){
      return this.compra.estadoCompra === 'PENDIENTE';
    }
    return false;
  }

  realizarPago(): void {
    this.detalleCompraService.realizarPagoMercadoPago(this.compra.id).subscribe(response => {
      const preference = response.respuesta;
      console.log(preference);
      if (preference && preference.initPoint) {
        // Redirige al usuario al URL de inicio de pago de Mercado Pago
        window.location.href = preference.initPoint;
      } else {
        console.error('Error al obtener la preferencia de pago');
      }
    }, error => {
      console.error('Error al realizar el pago:', error);
    });
  }
}
