import { Injectable } from '@angular/core';
import { PublicoService } from './publico.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { AdminService } from './admin.service';
import { CuponDTO } from '../dto/cupon/cupon-dto';
import { EditarCuponDTO } from '../dto/cupon/editar-cupon-dto';
import { CrearCuponDTO } from '../dto/cupon/crear-cupon-dto';

@Injectable({
  providedIn: 'root',
})
export class CrearCuponService {

  constructor(
    private publicService: PublicoService,
    private adminService: AdminService
  ) {}
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


}
