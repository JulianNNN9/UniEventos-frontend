import { Component } from '@angular/core';
import { EventosService } from '../../servicios/eventos.service';
import { EventoDTO } from '../../dto/evento-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  filtros = {
    nombre: '',
    tipo: '',
    ciudad: ''
  };

  eventos: EventoDTO[];

  tiposDeEvento: string[];

  eventosFiltrados: any[] = [];

  constructor(public eventosService:EventosService) {
    this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
    this.eventos = eventosService.listar();
  }

  public buscarEventos() {
    // Aquí implementarías la lógica para filtrar los eventos según los valores ingresados
    console.log('Filtrando con:', this.filtros);
    // Ejemplo de cómo podrías usar los filtros
    this.eventosFiltrados = this.eventos.filter(evento =>
      (this.filtros.nombre ? evento.nombre.includes(this.filtros.nombre) : true) &&
      (this.filtros.tipo ? evento.tipo === this.filtros.tipo : true) &&
      (this.filtros.ciudad ? evento.ciudad.includes(this.filtros.ciudad) : true)
    );
  }
}
