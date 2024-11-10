import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearEventoDTO } from '../dto/evento/crear-evento-dto';
import { EditarEventoDTO } from '../dto/evento/editar-evento-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root',
})
export class CrearEventoService {

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}

  public listarCiudades(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarCiudades();
  }
  public listarTipoEventos(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarTipoEventos();
  }
  public listarEstadoEventos(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarEstadoEventos();
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

}
