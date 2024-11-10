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

  constructor(
    private route: ActivatedRoute,
    private detalleCompraService: DetalleCompraService,
    private tokenService: TokenService,
    private eventoService: EventosService // Agregar el servicio de eventos para obtener la imagen
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
        this.compra = compra.respuesta;
        this.obtenerImagenesEventos(); // Llamar al método para obtener las imágenes de portada
        if (this.isCliente() && this.tokenService.getIDCuenta() === this.compra.idUsuario) {
          this.isAutorizado = true;
        }
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

  isLogged() {
    return this.tokenService.isLogged();
  }

  isCliente() {
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }

  isPendiente() {
    return this.compra.id ? this.compra.estadoCompra === 'PENDIENTE' : false;
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
}