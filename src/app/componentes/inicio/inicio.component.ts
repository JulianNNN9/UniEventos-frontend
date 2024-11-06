import { Component } from '@angular/core';
import { EventosService } from '../../servicios/eventos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventoDTO } from '../../dto/evento/evento-dto';
import { ItemEventoDTO } from '../../dto/evento/item-evento-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { FiltrosEventosDTO } from '../../dto/filtros-evento-dto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  filtros = { nombreEvento: '', tipoEvento: '', ciudadEvento: '' };

  eventos: ItemEventoDTO[] = [];
  tiposDeEvento: string[] = [];
  ciudades: string[] = [];
  paginaActual: number = 0; // Índice de la página actual
  hayMasEventos: boolean = true; // Indica si hay más eventos disponibles

  constructor(public eventosService: EventosService) {}

  ngOnInit() {
    this.cargarEventos();
    this.cargarTipoEventos();
    this.cargarCiudades();
  }

  cargarEventos() {
    this.eventosService
      .listarEventosPaginadosItem(this.paginaActual)
      .subscribe((eventos: MensajeDTO<ItemEventoDTO[]>) => {
        this.eventos = eventos.respuesta;
        this.hayMasEventos = eventos.respuesta.length > 0; // Verifica si hay eventos
        this.eventosService.setEventos(eventos.respuesta);
      });
  }
  cargarTipoEventos() {
    this.eventosService
      .listarTipoEventos()
      .subscribe((tipoEventos: MensajeDTO<string[]>) => {
        this.tiposDeEvento = tipoEventos.respuesta;
      });
  }
  cargarCiudades() {
    this.eventosService
      .listarCiudades()
      .subscribe((ciudades: MensajeDTO<string[]>) => {
        this.ciudades = ciudades.respuesta;
      });
  }

  cambiarPagina(indice: number) {
    this.paginaActual = indice;
    this.cargarEventos();
  }

  buscarEventos() {
    this.eventosService.filtrarEventosItem(this.filtros as FiltrosEventosDTO).subscribe((eventos) => {
      this.eventos = eventos.respuesta;
    })
  }
}