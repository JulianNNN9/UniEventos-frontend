import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../servicios/eventos.service';
import { CommonModule } from '@angular/common';
import { EventoDTO } from '../../dto/evento/evento-dto';
import { ItemEventoDTO } from '../../dto/evento/item-evento-dto';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { DetalleEventoService } from '../../servicios/detalle-evento.service';
import { CarritoService } from '../../servicios/carrito.service';
import { AgregarItemDTO } from '../../dto/carrito/agregar-item-dto';
import { FormsModule } from '@angular/forms';
import { LocalidadDTO } from '../../dto/evento/localidad-dto';


@Component({
 selector: 'app-detalle-evento',
 standalone: true,
 imports: [FormsModule, CommonModule],
 templateUrl: './detalle-evento.component.html',
 styleUrl: './detalle-evento.component.css'
})
export class DetalleEventoComponent {
  codigoEvento: string = '';
  evento: InformacionEventoDTO;
  cantidad: number = 1; // Variable para la cantidad seleccionada
  localidadSeleccionada: LocalidadDTO | null = null; // Variable para la localidad seleccionada

  constructor(
    private route: ActivatedRoute,
    private detalleEventoService: DetalleEventoService,
    private carritoService: CarritoService
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
      estadoEvento: ''
    };

    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.obtenerEvento();
    });
  }

  public obtenerEvento() {
    this.detalleEventoService.obtenerEvento(this.codigoEvento).subscribe(
      (respuesta: MensajeDTO<InformacionEventoDTO>) => {
        this.evento = respuesta.respuesta;
      }
    );
  }

  public agregarAlCarrito() {
    if (this.localidadSeleccionada) {
      const agregarItemDTO: AgregarItemDTO = {
        idCarrito: '1', // Aquí deberías obtener el ID del carrito actual
        informacionDetalleCarrito: {
          cantidad: this.cantidad,
          nombreLocalidad: this.localidadSeleccionada.nombreLocalidad,
          idEvento: this.evento.id
        }
      };

      this.carritoService.agregarItemCarrito(agregarItemDTO).subscribe(respuesta => {
        alert(`Localidad "${this.localidadSeleccionada}" agregada al carrito!`);
      });
    } else {
      alert('Por favor, selecciona una localidad.');
    }
  }

  public seleccionarLocalidad(localidad: LocalidadDTO) {
    this.localidadSeleccionada = localidad;
  }
}
