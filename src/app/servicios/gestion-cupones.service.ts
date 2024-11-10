import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AdminService } from './admin.service';
import { CuponDTO } from '../dto/cupon/cupon-dto';
import { EliminarCuponesDTO } from '../dto/cupon/eliminar-cupones-dto';

@Injectable({
  providedIn: 'root',
})
export class GestionCuponesService {
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
