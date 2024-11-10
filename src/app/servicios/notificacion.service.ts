import { Injectable } from '@angular/core';
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
