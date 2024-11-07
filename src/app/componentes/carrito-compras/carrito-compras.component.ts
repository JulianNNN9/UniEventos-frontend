import { Component } from '@angular/core';
import { InformacionCarritoDTO } from '../../dto/carrito/informacion-carrito-dto';
import { CarritoService } from '../../servicios/carrito.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { EventosService } from '../../servicios/eventos.service';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicios/token.service';
import { RouterModule } from '@angular/router';
import { DetalleCarritoDTO } from '../../dto/carrito/detalle-carrito-dto';
import { EditarCarritoDTO } from '../../dto/carrito/editar-carrito-dto';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';
import { InformacionCuponDTO } from '../../dto/cupon/informacion-cupon-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, AlertMessagesModule],
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css'],
})
export class CarritoComprasComponent {
  carrito: InformacionCarritoDTO;
  codigoCupon: string = '';
  informacionCuponDTO: InformacionCuponDTO | null=null;
  detalleCarritos: DetalleCarritoDTO[] = []; // Aquí se almacenarán los eventos con sus detalles completos

  constructor(
    private carritoService: CarritoService,
    private eventoService: EventosService,
    private tokenService: TokenService,
    private alertMessageService: AlertMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService
      .obtenerCarrito()
      .subscribe((carrito: MensajeDTO<InformacionCarritoDTO>) => {
        this.carrito = carrito.respuesta;
        this.obtenerDetallesEventos();
      });
  }

  obtenerDetallesEventos() {
    this.detalleCarritos = []; // Limpiar eventos previos

    // Por cada item en el carrito, consultar el detalle del evento
    this.carrito.itemsCarrito.forEach((item) => {
      this.eventoService
        .obtenerEvento(item.idEvento)
        .subscribe((evento: MensajeDTO<InformacionEventoDTO>) => {
          // Buscar la localidad que coincide con el nombre dado
          const localidadEncontrada = evento.respuesta.localidades.find(
            (localidad) => localidad.nombreLocalidad === item.nombreLocalidad
          );

          // Asegurarse de que la localidad se encontró y obtener su precio
          const precioLocalidad = localidadEncontrada
            ? localidadEncontrada.precioLocalidad
            : 0;

          // Añadir el detalle al array de detalleCarritos
          this.detalleCarritos.push({
            cantidad: item.cantidad,
            nombreLocalidad: item.nombreLocalidad,
            precioLocalidad: precioLocalidad, // Precio encontrado
            evento: evento.respuesta,
          });
        });
    });
    this.carritoService.setDetalleCarrito(this.detalleCarritos);
  }
  // Método para eliminar un item del carrito
  public eliminarCarrito(detalleCarrito: DetalleCarritoDTO) {
    this.carritoService
      .eliminarItemCarrito(this.carrito.id, detalleCarrito)
      .subscribe({
        next: () => {
          console.log('Item eliminado correctamente del carrito');
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
  }
  // Método para cambiar la cantidad de un item
  cambiarCantidad(detalleCarrito: any, cambio: number) {
    if (detalleCarrito.cantidad + cambio >= 1) {
      // Asegúrate de que la cantidad no sea menor que 1
      detalleCarrito.cantidad += cambio;
      this.editarCarrito(detalleCarrito); // Llamar al servicio para editar el carrito
    }
  }

  // Método para editar el carrito, se llama cuando la cantidad cambia
  editarCarrito(detalleCarrito: any) {
    const editarCarritoDTO: EditarCarritoDTO = {
      idCarrito: this.carrito.id,
      nombreLocalidad: detalleCarrito.nombreLocalidad,
      idEvento: detalleCarrito.evento.id,
      cantidadActualizada: detalleCarrito.cantidad,
    };
    this.carritoService.editarCarrito(editarCarritoDTO).subscribe(
      (response) => {
        console.log('Carrito actualizado correctamente', response);
      },
      (error) => {
        console.error('Error al actualizar el carrito', error);
      }
    );
  }
  validarCupon() {
    if (this.informacionCuponDTO == null) {
      this.carritoService
        .validarCupon(this.codigoCupon, this.tokenService.getIDCuenta())
        .subscribe({
          next: (respuesta: MensajeDTO<InformacionCuponDTO>) => {
            this.informacionCuponDTO = respuesta.respuesta;
            Swal.fire({
              title: 'Validar Cupon',
              text: 'Cupón validado correctamente',
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
        this.codigoCupon = '';
    } else {
      this.alertMessageService.show(
        `Ya tiene validado el cupón: ${this.informacionCuponDTO.codigo}`,
        { cssClass: 'alerts-error', timeOut: 4000 }
      );
      this.codigoCupon = '';
    }
  }
  eliminarCupon() {
    this.informacionCuponDTO = null;
    this.codigoCupon = '';
  }
  calcularDescuento(){
    if(!(this.informacionCuponDTO == null)){
      return this.calcularSubtotal() * (this.informacionCuponDTO.porcentajeDescuento / 100);
    }else{
      return 0;
    }
  }
  calcularEnvio(){
    return 0;
  }
  calcularTotal() {
    return this.calcularSubtotal() - this.calcularDescuento();
  }
  calcularSubtotal(){
    let subtotal: number = 0;
    this.detalleCarritos.forEach((detalle) => {
      subtotal += detalle.cantidad * detalle.precioLocalidad;
    });
    return subtotal;
  }

  procesarPago() {
    this.carritoService
    .crearCompra(this.tokenService.getIDCuenta(), this.informacionCuponDTO)
    .subscribe({
      next: (respuesta) => {
        Swal.fire({
          title: 'Pago Creado',
          text: respuesta.respuesta,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // Una vez que el modal de éxito se haya cerrado, redirigir a la ruta 'detalle-compra'
          const idOrden = respuesta.respuesta;  // Aquí asumo que la respuesta tiene un campo 'id' con el ID de la compra
          this.router.navigate([`/detalle-compra/${idOrden}`]);  // Redirige al detalle de la compra con el ID
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
  }
  isAutenticado() {
    return this.tokenService.isLogged();
  }
  isCliente() {
    if (this.isAutenticado() && this.tokenService.getRol() === 'CLIENTE') {
      return true;
    }
    return false;
  }
}
