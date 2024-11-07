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
import { InformacionCompraDTO } from '../dto/compra/informacion-compra-dto';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root',
})
export class DetalleCompraService {
  eventos: InformacionEventoDTO[] = [];

  constructor(
    private clienteService: ClienteService,
    private adminService: AdminService
  ) {}
  setEventos(eventos: InformacionEventoDTO[]) {
    this.eventos = eventos;
  }
  obtenerCompra(idCompra: string): Observable<MensajeDTO<InformacionCompraDTO>> {
    return this.clienteService.obtenerCompra(idCompra);
  }
  realizarPagoMercadoPago(idOrden: string): Observable<MensajeDTO<any>> {
    return this.clienteService.realizarPago(idOrden);
  }
}
