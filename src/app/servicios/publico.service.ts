import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/crear-usuario-dto';
import { LoginDTO } from '../dto/login-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenDTO } from '../dto/token-dto';
import { InformacionEventoDTO } from '../dto/evento/informacion-evento-dto';
import { ItemEventoDTO } from '../dto/evento/item-evento-dto';
import { FiltrosEventosDTO } from '../dto/filtros-evento-dto';
import { NotificacionEventoDTO } from '../dto/evento/notificacion-evento-dto';
import { RecuperarContraseniaDTO } from '../dto/cuenta/recuperar-contrasenia-dto';
import { ActivarCuentaDTO } from '../dto/cuenta/activar-cuenta-dto';

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private authURL = 'http://localhost:8080/api/publico';

  constructor(private http: HttpClient) {}

  public crearUsuario(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO<String>> {
    return this.http.post<MensajeDTO<String>>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO<TokenDTO>> {
    return this.http.post<MensajeDTO<TokenDTO>>(
      `${this.authURL}/iniciar-sesion`,
      loginDTO
    );
  }
  public obtenerInformacionEvento(idEvento: string): Observable<MensajeDTO<InformacionEventoDTO>> {
    return this.http.get<MensajeDTO<InformacionEventoDTO>>(
      `${this.authURL}/eventos/obtener-informacion-evento/${idEvento}`
    );
  }

  public filtrarEvento(filtrosEventos: FiltrosEventosDTO): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.http.post<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/filtrar-evento`,
      filtrosEventos
    );
  }

  public buscarEvento(nombreEvento: string): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.http.get<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/buscar-evento/${nombreEvento}`
    );
  }

  public listarEventos(): Observable<MensajeDTO<ItemEventoDTO[]>> {
    return this.http.get<MensajeDTO<ItemEventoDTO[]>>(
      `${this.authURL}/eventos/listar-eventos`
    );
  }

  public notificarNuevoEvento(): Observable<MensajeDTO<NotificacionEventoDTO[]>> {
    return this.http.get<MensajeDTO<NotificacionEventoDTO[]>>(
      `${this.authURL}/eventos/notificar-nuevo-evento`
    );
  }

  public enviarCodigoRecuperacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-recuperacion`,
      { params }
    );
  }

  public enviarCodigoActivacion(correo: string): Observable<MensajeDTO<string>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<MensajeDTO<string>>(
      `${this.authURL}/enviar-codigo-activacion`,
      { params }
    );
  }

  public activarCuenta(activarCuentaDTO: ActivarCuentaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/activar-cuenta`, 
      activarCuentaDTO
    );
  }

  public recuperarContrasenia(recuperarContraseniaDTO: RecuperarContraseniaDTO): Observable<MensajeDTO<string>> {
    return this.http.post<MensajeDTO<string>>(
      `${this.authURL}/recuperar-contrasenia`,
      recuperarContraseniaDTO
    );
  }
}
