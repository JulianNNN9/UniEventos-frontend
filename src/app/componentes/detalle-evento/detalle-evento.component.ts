import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { DetalleEventoService } from '../../servicios/detalle-evento.service';
import { CarritoService } from '../../servicios/carrito.service';
import { AgregarItemDTO } from '../../dto/carrito/agregar-item-dto';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../servicios/token.service';
import { InformacionCarritoDTO } from '../../dto/carrito/informacion-carrito-dto';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './detalle-evento.component.html',
  styleUrl: './detalle-evento.component.css',
})
export class DetalleEventoComponent {
  idCarrito: string = ''; 
  codigoEvento: string = '';
  evento: InformacionEventoDTO;
  cantidad: number = 1; // Variable para la cantidad seleccionada
  localidadSeleccionada: any = null; // Variable para la localidad seleccionada

  constructor(
    private route: ActivatedRoute,
    private detalleEventoService: DetalleEventoService,
    private carritoService: CarritoService,
    private tokenService: TokenService,
    private alertMessageService: AlertMessagesService
  ) {
    this.evento = {
      id: '',
      nombreEvento: '',
      descripcionEvento: '',
      fechaEvento: '',
      tipoEvento: '',
      direccionEvento: '',
      ciudadEvento: '',
      localidades: [],
      imagenPortada: '',
      imagenLocalidades: '',
      estadoEvento: '',
    };

    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.obtenerEvento();
    });
  }
  ngOnInit(){
    if(this.isCliente()){
      this.obtenerIdCarrito();
    }
  }

  public obtenerEvento() {
    this.detalleEventoService
      .obtenerEvento(this.codigoEvento)
      .subscribe((respuesta) => {
        this.evento = respuesta.respuesta;
      });
  }
  obtenerIdCarrito() {
    this.carritoService.obtenerCarrito().subscribe((respuesta: MensajeDTO<InformacionCarritoDTO>) => {
      this.idCarrito = respuesta.respuesta.id;
    }); 
  }
  public agregarAlCarrito() {
    if(this.isCliente()){
      if (this.localidadSeleccionada) {
        if (this.cantidad < 1) {
          alert('La cantidad debe ser al menos 1');
          return;
        }
  
        const agregarItemDTO: AgregarItemDTO = {
          idCarrito: this.idCarrito, // Aquí deberías obtener el ID del carrito actual (idealmente desde el estado del carrito)
          informacionDetalleCarritoDTO: {
            cantidad: this.cantidad,
            nombreLocalidad: this.localidadSeleccionada.nombreLocalidad,
            idEvento: this.evento.id,
          },
        };
  
        this.carritoService
          .agregarItemCarrito(agregarItemDTO)
          .subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Localidad Agregada',
                text: data.respuesta,
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error.error.respuesta,
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            },
          });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Por favor selecciona una localidad',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Debes iniciar sesión como cliente para agregar al carrito',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }
  isAutenticado(){
    return this.tokenService.isLogged();
  }
  isCliente() {
    if (
      this.isAutenticado() &&
      this.tokenService.getRol() === 'CLIENTE'
    ) {
      return true;
    }
    return false;
  }
  public seleccionarLocalidad(localidad: any) {
    if (this.localidadSeleccionada === localidad) {
      this.localidadSeleccionada = null; // Desmarcar si ya está seleccionada
    } else {
      this.localidadSeleccionada = localidad; // Marcar como seleccionada
      this.alertMessageService.show(
        `Localidad seleccionada: ${localidad.nombreLocalidad}`,
        { cssClass: 'alerts-success', timeOut: 4000 }
      );
    }
  }
}
