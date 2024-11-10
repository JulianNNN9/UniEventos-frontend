import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';

@Injectable({
  providedIn: 'root',
})
export class DetalleEventoService {

  constructor(
    private publicService: PublicoService,
  ) {}

  obtenerEvento(index: string): Observable<MensajeDTO<InformacionEventoDTO>> {
    return this.publicService.obtenerInformacionEvento(index);
  }


}
