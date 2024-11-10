import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { AdminService } from './admin.service';
import { FiltrosEventosDTO } from '../dto/filtros-evento-dto';
import { EliminarEventosDTO } from '../dto/evento/eliminar-eventos-dto';

@Injectable({
  providedIn: 'root',
})
export class GestionEventosService {
  eventos: InformacionEventoDTO[] = [];

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}
  setEventos(eventos: InformacionEventoDTO[]) {
    this.eventos = eventos;
  }
  public listarEventosPaginadosInfo(pagina: number, tamanio: number): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.publicService.listarEventosPaginadosInfo(pagina, tamanio);
  }
  public listarCiudades(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarCiudades();
  }
  public listarTipoEventos(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarTipoEventos();
  }
  public filtrarEventosInfo(filtrosEventosDTO: FiltrosEventosDTO): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.publicService.filtrarEventoInfo(filtrosEventosDTO);
  }
  eliminarEvento(evento: InformacionEventoDTO): Observable<MensajeDTO<string>> {
    const indice: number = this.eventos.indexOf(evento);
    this.eventos.splice(indice, 1);
    return this.adminService.eliminarEvento(evento.id);
  }
  eliminarEventos(listaIdEventos: EliminarEventosDTO): Observable<MensajeDTO<string>> {
    listaIdEventos.listaIdEventos.forEach((id) => {
      const indice: number = this.eventos.findIndex((evento) => evento.id === id);
      this.eventos.splice(indice, 1);
    });
    console.log(this.eventos);
    return this.adminService.eliminarEventos(listaIdEventos);
  }
}
