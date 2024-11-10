import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicoService } from './publico.service';
import { AdminService } from './admin.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { InformacionCuponDTO } from '../dto/cupon/informacion-cupon-dto';
import { CuponDTO } from '../dto/cupon/cupon-dto';
import { EliminarCuponesDTO } from '../dto/cupon/eliminar-cupones-dto';

@Injectable({
  providedIn: 'root',
})
export class GestionCuponesService {
  cupones: InformacionCuponDTO[] = [];

  constructor(
    private adminService: AdminService
  ) {}

  setCupones(cupones: InformacionCuponDTO[]) {
    this.cupones = cupones;
  }

  crearCupon(crearCuponDTO: CrearCuponDTO): Observable<MensajeDTO<string>> {
    return this.adminService.crearCupon(crearCuponDTO);
  }

  obtenerCupones(): Observable<MensajeDTO<CuponDTO[]>> {
    return this.adminService.listarCupones();
  }

  editarCupon(editarCuponDTO: EditarCuponDTO): Observable<MensajeDTO<string>> {
    return this.adminService.editarCupon(editarCuponDTO);
  }

  eliminarCupon(cupon: InformacionCuponDTO): Observable<MensajeDTO<string>> {
    const indice: number = this.cupones.indexOf(cupon);
    this.cupones.splice(indice, 1);
    return this.adminService.eliminarCupon(cupon.codigo);
  }

  eliminarCupones(listaIdCupones: EliminarCuponesDTO): Observable<MensajeDTO<string>> {
    listaIdCupones.listaIdCupones.forEach((id) => {
      const indice: number = this.cupones.findIndex((cupon) => cupon.codigo === id);
      this.cupones.splice(indice, 1);
    });
    console.log(this.cupones);
    return this.adminService.eliminarCupones(listaIdCupones);
  }
}
