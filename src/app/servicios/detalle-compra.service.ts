import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { InformacionCompraDTO } from '../dto/compra/informacion-compra-dto';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root',
})
export class DetalleCompraService {

  constructor(
    private clienteService: ClienteService,
  ) {}

  obtenerCompra(idCompra: string): Observable<MensajeDTO<InformacionCompraDTO>> {
    return this.clienteService.obtenerCompra(idCompra);
  }
  realizarPagoMercadoPago(idOrden: string): Observable<MensajeDTO<any>> {
    return this.clienteService.realizarPago(idOrden);
  }
  cancelarCompra(idOrden: string): Observable<MensajeDTO<string>> {
    return this.clienteService.cancelarCompra(idOrden);
  }
}
