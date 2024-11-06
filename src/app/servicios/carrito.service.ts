import { Injectable } from '@angular/core';
import { EventoDTO } from '../dto/evento/evento-dto';
import { AgregarItemDTO } from '../dto/carrito/agregar-item-dto';
import { ClienteService } from './cliente.service';
@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carrito: EventoDTO[] = [];

  constructor(
    private clienteService: ClienteService
  ){

  }
  agregarItemCarrito(agregarItemDTO: AgregarItemDTO) {
    return this.clienteService.agregarCarrito(agregarItemDTO);
  }

  obtenerCarrito(): EventoDTO[] {
    return this.carrito;
  }

  limpiarCarrito() {
    this.carrito = [];
  }
}

