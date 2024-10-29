import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearUsuarioDTO } from '../dto/crear-usuario-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';

@Injectable({
  providedIn: 'root',
})
export class PublicoService {
  private authURL = 'http://localhost:8080/api/publico';

  constructor(private http: HttpClient) {}

  public crearCuenta(cuentaDTO: CrearUsuarioDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(
      `${this.authURL}/crear-usuario`,
      cuentaDTO
    );
  }
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(
      `${this.authURL}/iniciar-sesion`,
      loginDTO
    );
  }
}
