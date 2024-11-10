import { Injectable } from '@angular/core';
import { AgregarItemDTO } from '../dto/carrito/agregar-item-dto';
import { ClienteService } from './cliente.service';
import { InformacionCarritoDTO } from '../dto/carrito/informacion-carrito-dto';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { EditarCarritoDTO } from '../dto/carrito/editar-carrito-dto';
import { EliminarDelCarritoDTO } from '../dto/carrito/eliminar-del-carrito-dto';
import { DetalleCarritoDTO } from '../dto/carrito/detalle-carrito-dto';
import { InformacionCuponDTO } from '../dto/cupon/informacion-cupon-dto';
import { CrearCompraDTO } from '../dto/compra/crear-compra-dto';
import { InformacionItemCompraDTO } from '../dto/compra/informacion-item-compra-dto';
@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  
  detalleCarritos: DetalleCarritoDTO[] = [];
  
  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ){

  }
  setDetalleCarrito(detalleCarritos: DetalleCarritoDTO[]) {
    this.detalleCarritos = detalleCarritos;
  }
  editarCarrito(editarCarritoDTO: EditarCarritoDTO): Observable<MensajeDTO<string>> {
    return this.clienteService.editarCarrito(editarCarritoDTO);
  }
  eliminarItemCarrito(idCarrito: string, detalleCarritoDTO: DetalleCarritoDTO): Observable<MensajeDTO<string>> {
    const indice: number = this.detalleCarritos.indexOf(detalleCarritoDTO);
    this.detalleCarritos.splice(indice, 1);
    const eliminarDelCarrito: EliminarDelCarritoDTO = {
      idCarrito: idCarrito,
      nombreLocalidad: detalleCarritoDTO.nombreLocalidad,
      idEvento: detalleCarritoDTO.evento.id,
    };
    return this.clienteService.eliminarCarrito(eliminarDelCarrito);
  }

  agregarItemCarrito(agregarItemDTO: AgregarItemDTO): Observable<MensajeDTO<string>> {
    return this.clienteService.agregarCarrito(agregarItemDTO);
  }
  validarCupon(codigoCupon: string, idUsuario: string): Observable<MensajeDTO<InformacionCuponDTO>> {
    return this.clienteService.validarCupon(codigoCupon, idUsuario);
  }

  obtenerCarrito(): Observable<MensajeDTO<InformacionCarritoDTO>> {
    return this.clienteService.obtenerCarrito(this.tokenService.getIDCuenta());
  }
  crearCompra(idUsuario: string, informacionCuponDTO: InformacionCuponDTO | null=null): Observable<MensajeDTO<string>> {
    let codigoCupon: string = '';
    if(informacionCuponDTO != null){
      codigoCupon = informacionCuponDTO.codigo;
    }
    const itemsCompra: InformacionItemCompraDTO[] = this.detalleCarritos.map((detalle) => ({
      idEvento: detalle.evento.id,
      nombreLocalidad: detalle.nombreLocalidad,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioLocalidad
    }));
    const crearCompraDTO: CrearCompraDTO = {
      idUsuario: idUsuario,
      informacionItemCompraDTOS: itemsCompra,
      codigoCupon: codigoCupon
    };
    return this.clienteService.crearCompra(crearCompraDTO);
  }

  limpiarCarrito() {
    this.detalleCarritos.splice(0, this.detalleCarritos.length);
  }
}

