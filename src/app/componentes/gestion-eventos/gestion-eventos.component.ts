import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { GestionEventosService } from '../../servicios/gestion-eventos.service';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosEventosDTO } from '../../dto/filtros-evento-dto';
import { EliminarEventosDTO } from '../../dto/evento/eliminar-eventos-dto';


@Component({
 selector: 'app-gestion-eventos',
 standalone: true,
 imports: [FormsModule, RouterModule, CommonModule],
 templateUrl: './gestion-eventos.component.html',
 styleUrl: './gestion-eventos.component.css'
})
export class GestionEventosComponent {
  eventos: InformacionEventoDTO[] = [];
  seleccionados: InformacionEventoDTO[] = [];
  filtros = { nombreEvento: '', tipoEvento: '', ciudadEvento: '' };
  tiposDeEvento: string[] = [];
  ciudades: string[] = [];
  textoBtnEliminar = '';
  paginaActual = 0;
  eventosPorPagina = 12;
  hayMasPaginas = true;

  constructor(private gestionEventosService: GestionEventosService) {}

  ngOnInit() {
    this.cargarEventosPaginados();
    this.cargarTiposDeEvento();
    this.cargarCiudades();
  }

  cargarEventosPaginados() {
    this.gestionEventosService.listarEventosPaginadosInfo(this.paginaActual, this.eventosPorPagina)
      .subscribe((respuesta: MensajeDTO<InformacionEventoDTO[]>) => {
        this.eventos = respuesta.respuesta;
        this.hayMasPaginas = this.eventos.length > 0;
        this.gestionEventosService.setEventos(this.eventos);
      });
  }

  cambiarPagina(indice: number) {
    this.paginaActual = indice;
    this.cargarEventosPaginados();
  }

  buscarEventos() {
    this.gestionEventosService.filtrarEventosInfo(this.filtros as FiltrosEventosDTO)
      .subscribe((eventos) => {
        this.eventos = eventos.respuesta;
        this.gestionEventosService.setEventos(this.eventos);
      });
  }

  cargarTiposDeEvento() {
    this.gestionEventosService.listarTipoEventos()
      .subscribe((tipos) => {
        this.tiposDeEvento = tipos.respuesta;
      });
  }

  cargarCiudades() {
    this.gestionEventosService.listarCiudades()
      .subscribe((ciudades) => {
        this.ciudades = ciudades.respuesta;
      });
  }

  trackById(index: number, item: InformacionEventoDTO) {
    return item.id;
  }

  seleccionar(evento: InformacionEventoDTO, estado: boolean) {
    if (estado) {
      this.seleccionados.push(evento);
    } else {
      this.seleccionados = this.seleccionados.filter(e => e.id !== evento.id);
    }
    this.actualizarMensaje();
  }

  actualizarMensaje() {
    const tam = this.seleccionados.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} elemento${tam > 1 ? 's' : ''}` : '';
  }

  eliminarEventos() {
    const listaIdEventos = this.seleccionados.map(evento => evento.id);
    const eliminarEventosDTO: EliminarEventosDTO = { listaIdEventos };
    return this.gestionEventosService.eliminarEventos(eliminarEventosDTO);
  }

  eliminarEvento(evento: InformacionEventoDTO) {
    return this.gestionEventosService.eliminarEvento(evento)
  }

  confirmarEliminacionEventos() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cambiará el estado de los eventos a Inactivos.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarEventos().subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Eventos eliminados',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            this.seleccionados = [];
            this.actualizarMensaje();
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            this.seleccionados = [];
            this.actualizarMensaje();
          },
        });
      }
    });
  }
  confirmarEliminacionEvento(evento: InformacionEventoDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cambiará el estado del evento a Inactivo',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarEvento(evento).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Evento eliminado',
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
      }
    });
  }
}