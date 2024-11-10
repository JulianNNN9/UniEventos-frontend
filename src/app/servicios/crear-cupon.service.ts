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
import { EliminarEventosDTO } from '../dto/evento/eliminar-eventos-dto';
import { CuponDTO } from '../dto/cupon/cupon-dto';
import { EliminarCuponesDTO } from '../dto/cupon/eliminar-cupones-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';

@Injectable({
  providedIn: 'root',
})
export class CrearCuponService {
  cupones: CuponDTO[] = [];

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}
  setCupones(cupones: CuponDTO[]) {
    this.cupones = cupones;
  }
  public listarCupones(): Observable<MensajeDTO<CuponDTO[]>> {
    return this.publicService.listarCupones();
  }
  public listarTipoCupones(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarTipoCupones();
  }
  public listarEstadoCupones(): Observable<MensajeDTO<string[]>> {
    return this.publicService.listarEstadoCupones();
  }
  crearCupon(crearCuponDTO: CrearCuponDTO): Observable<MensajeDTO<string>> {
    return this.adminService.crearCupon(crearCuponDTO);
  }
  obtenerCupon(index: string): Observable<MensajeDTO<CuponDTO>> {
    return this.publicService.obtenerCupon(index);
  }
  editarCupon(editarCuponDTO: EditarCuponDTO): Observable<MensajeDTO<string>> {
    return this.adminService.editarCupon(editarCuponDTO);
  }
  eliminarCupon(cuponDTO: CuponDTO): Observable<MensajeDTO<string>> {
    const indice: number = this.cupones.indexOf(cuponDTO);
    this.cupones.splice(indice, 1);
    return this.adminService.eliminarCupon(cuponDTO.id);
  }
  eliminarCupones(eliminarCuponesDTO: EliminarCuponesDTO): Observable<MensajeDTO<string>> {
    eliminarCuponesDTO.listaIdCupones.forEach((id) => {
      const indice: number = this.cupones.findIndex((cupon) => cupon.id === id);
      this.cupones.splice(indice, 1);
    });
    return this.adminService.eliminarCupones(eliminarCuponesDTO);
  }
}
