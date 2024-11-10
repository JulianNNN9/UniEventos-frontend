import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearEventoDTO } from '../dto/evento/crear-evento-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { EditarEventoDTO } from '../dto/evento/editar-evento-dto';
import { Observable } from 'rxjs';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { CuponDTO } from '../dto/cupon/cupon-dto';
import { EliminarEventosDTO } from '../dto/evento/eliminar-eventos-dto';
import { EliminarCuponesDTO } from '../dto/cupon/eliminar-cupones-dto';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authURL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}
  public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/eventos/crear-evento`,
      crearEventoDTO
    );
  }

  public editarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(
      `${this.authURL}/eventos/editar-evento`,
      editarEventoDTO
    );
  }

  public eliminarEvento(idEvento: string): Observable<MensajeDTO<string>> {
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/eventos/eliminar-evento/${idEvento}`
    );
  }
  public eliminarEventos(eliminarEventosDTO: EliminarEventosDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/eventos/eliminar-eventos`,
      eliminarEventosDTO
    );
  }

  public subirImagen(imagen: File): Observable<MensajeDTO<string>> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/imagenes/subir-imagen`,
      formData
    );
  }

  public crearCupon(crearCuponDTO: CrearCuponDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/cupon/crear-cupon`,
      crearCuponDTO
    );
  }

  public editarCupon(editarCuponDTO: EditarCuponDTO): Observable<MensajeDTO<string>> {
    return this.http.put<MensajeDTO<string>>(
      `${this.authURL}/cupon/editar-cupon`,
      editarCuponDTO
    );
  }

  public eliminarCupon(idCupon: string): Observable<MensajeDTO<string>> {
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/cupon/eliminar-cupon/${idCupon}`
    );
  }
  public eliminarCupones(eliminarCuponesDTO: EliminarCuponesDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/cupon/eliminar-cupones`,
      eliminarCuponesDTO
    );
  }

  public eliminarImagen(idImagen: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('idImagen', idImagen);
    return this.http.delete<MensajeDTO<string>>(
      `${this.authURL}/imagenes/eliminar-imagen`,
      { params }
    );
  }
}
