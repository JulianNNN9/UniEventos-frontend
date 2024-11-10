import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { ItemEventoDTO } from '../dto/evento/item-evento-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { FiltrosEventosDTO } from '../dto/filtros-evento-dto';

@Injectable({
  providedIn: 'root',
})
export class EventosService {

  constructor(
    private publicService: PublicoService,
  ) {}
  public listarEventosPaginadosItem(pagina: number): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.publicService.listarEventosPaginadosItem(pagina, 12);
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
  obtenerEvento(index: string): Observable<MensajeDTO<InformacionEventoDTO>> {
    return this.publicService.obtenerInformacionEvento(index);
  }


}
