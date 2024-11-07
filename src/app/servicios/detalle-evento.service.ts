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

@Injectable({
  providedIn: 'root',
})
export class DetalleEventoService {
  eventos: InformacionEventoDTO[] = [];

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}
  setEventos(eventos: InformacionEventoDTO[]) {
    this.eventos = eventos;
  }
  public listarEventosPaginadosInfo(pagina: number): Observable<MensajeDTO<InformacionEventoDTO[]>> {
    return this.publicService.listarEventosPaginadosInfo(pagina, 8);
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
