import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { InformacionCompraDTO } from '../../dto/compra/informacion-compra-dto';
import { ActivatedRoute } from '@angular/router';
import { DetalleCompraService } from '../../servicios/detalle-compra.service';
import { TokenService } from '../../servicios/token.service';
import { EventosService } from '../../servicios/eventos.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';
import { ClienteService } from '../../servicios/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.css'
})
export class DetalleCompraComponent {
  compra: InformacionCompraDTO;
  imagenesEventos: { [idEvento: string]: string } = {}; // Almacenar URLs de imagen de portada por idEvento
  isAutorizado: boolean = false;
  compraConfirmada: boolean = false;  // Estado de la compra (Confirmada)
  error: string = '';  // Mensaje de error
  estadoCompra: string = ''; // Estado inicial

  constructor(
    private route: ActivatedRoute,
    private detalleCompraService: DetalleCompraService,
    private tokenService: TokenService,
    private eventoService: EventosService,
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

    // Verificar parámetros de la URL (en caso de que Mercado Pago redirija después de una notificación)
    this.route.queryParams.subscribe(params => {
      const collectionStatus = params['collection_status'];
      const paymentId = params['payment_id'];
      if (collectionStatus && paymentId) {
        this.actualizarEstadoCompra(collectionStatus);
      }
    });
  }

  obtenerCompra(idOrden: string): void {
    this.detalleCompraService.obtenerCompra(idOrden).subscribe({
      next: (compra) => {
        this.compra = compra.respuesta;
        this.obtenerImagenesEventos(); // Llamar al método para obtener las imágenes de portada
        if (this.isCliente() && this.tokenService.getIDCuenta() === this.compra.idUsuario) {
          this.isAutorizado = true;
        }
        this.estadoCompra = this.compra.estadoCompra;
      },
      error: (err) => {
        console.error('Error al obtener la compra:', err);
      }
    });
  }

  obtenerImagenesEventos(): void {
    this.compra.informacionItemCompraDTOS.forEach(item => {
      if (!this.imagenesEventos[item.idEvento]) {
        this.eventoService.obtenerEvento(item.idEvento).subscribe({
          next: (evento: MensajeDTO<InformacionEventoDTO>) => {
            this.imagenesEventos[item.idEvento] = evento.respuesta.imagenPortada;
          },
          error: (err) => {
            console.error(`Error al obtener la imagen del evento ${item.idEvento}`, err);
          }
        });
      }
    });
  }

  actualizarEstadoCompra(collectionStatus: string): void {
    if (collectionStatus === 'approved') {
      this.estadoCompra = 'COMPLETADA';
      this.compraConfirmada = true;
      this.error = ''; // Limpiar cualquier mensaje de error previo
    } else if (collectionStatus === 'rejected') {
      this.estadoCompra = 'RECHAZADA';
      this.error = 'La compra ha sido rechazada. Intenta nuevamente.';
    } else {
      this.estadoCompra = 'PENDIENTE';
      this.error = 'La compra está pendiente de confirmación.';
    }
  }

  isLogged() {
    return this.tokenService.isLogged();
  }

  isCliente() {
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }

  isPendiente() {
    return this.compra.id ? this.estadoCompra === 'PENDIENTE' : false;
  }

  realizarPago(): void {
    this.detalleCompraService.realizarPagoMercadoPago(this.compra.id).subscribe(response => {
      const preference = response.respuesta;
      if (preference && preference.initPoint) {
        window.location.href = preference.initPoint;
      } else {
        console.error('Error al obtener la preferencia de pago');
      }
    }, error => {
      console.error('Error al realizar el pago:', error);
    });
  }
  confirmarCancelacion(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cancelar esta compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener compra'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarCompra();
      }
    });
  }
  
  cancelarCompra(): void {
    this.detalleCompraService.cancelarCompra(this.compra.id).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Compra cancelada',
          text: response.respuesta,
          confirmButtonText: 'Aceptar'
        });
        this.compra.estadoCompra = 'CANCELADA';
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cancelar la compra',
          text: error.error.respuesta,
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cancelar la compra:', error);
      }
    });
  }
}