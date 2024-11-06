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
import { NotificacionEventoDTO } from '../dto/evento/notificacion-evento-dto';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  notificaciones: NotificacionEventoDTO[] = [];

  constructor(
    
  ) {}
  setNotificacioes(notificaciones: NotificacionEventoDTO[]) {
    this.notificaciones = notificaciones;
  }
  agregarNotificaion(notificacion: NotificacionEventoDTO){
    if(this.notificaciones == null){
      this.notificaciones = [];
  }
    this.notificaciones.push(notificacion);
  }
}
