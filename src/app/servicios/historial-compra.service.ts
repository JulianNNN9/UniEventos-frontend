import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { InformacionCompraDTO } from '../dto/compra/informacion-compra-dto';
import { ClienteService } from './cliente.service';
import { TokenService } from './token.service';

@Injectable()
export class HistorialComprasService {

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  obtenerComprasUsuario(): Observable<MensajeDTO<InformacionCompraDTO[]>> {
    return this.clienteService.obtenerComprasUsuario(this.tokenService.getIDCuenta());
  }

}
