import { Injectable } from '@angular/core';
import { EventoDTO } from '../dto/evento/evento-dto';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { ItemEventoDTO } from '../dto/evento/item-evento-dto';
import { CrearEventoDTO } from '../dto/evento/crear-evento-dto';
import { EditarEventoDTO } from '../dto/evento/editar-evento-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { AdminService } from './admin.service';
import { FiltrosEventosDTO } from '../dto/filtros-evento-dto';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  eventos: ItemEventoDTO[] = [];

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}
  setEventos(eventos: ItemEventoDTO[]) {
    this.eventos = eventos;
  }
  public listarEventosPaginadosItem(pagina: number): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.publicService.listarEventosPaginadosItem(pagina, 12);
  }
  public listarEventos(): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.publicService.listarEventos();
  }
  public listarCiudades(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarCiudades();
  }
  public listarTipoEventos(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarTipoEventos();
  }
  public filtrarEventosItem(filtrosEventosDTO: FiltrosEventosDTO): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.publicService.filtrarEventoItem(filtrosEventosDTO);
  }

  crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO<string>> {
    return this.adminService.crearEvento(crearEventoDTO);
  }
  obtenerEvento(index: string): Observable<MensajeDTO<InformacionEventoDTO>> {
    return this.publicService.obtenerInformacionEvento(index);
  }
  editarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO<string>> {
    return this.adminService.editarEvento(editarEventoDTO);
  }
  eliminarEvento(idEvento: string): Observable<MensajeDTO<string>> {
    return this.adminService.eliminarEvento(idEvento);
  }
}
