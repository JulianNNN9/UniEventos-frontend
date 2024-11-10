import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { GestionCuponesService } from '../../servicios/gestion-cupones.service';
import { InformacionCuponDTO } from '../../dto/cupon/informacion-cupon-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EliminarCuponesDTO } from '../../dto/cupon/eliminar-cupones-dto';

@Component({
  selector: 'app-gestion-cupones',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './gestion-cupones.component.html',
  styleUrls: ['./gestion-cupones.component.css']
})
export class GestionCuponesComponent {
  cupones: InformacionCuponDTO[] = [];
  seleccionados: InformacionCuponDTO[] = [];
  filtros = { codigoCupon: '', tipoCupon: '', estadoCupon: '' };
  tiposDeCupon: string[] = [];
  estadosCupon: string[] = [];
  textoBtnEliminar = '';
  paginaActual = 0;
  cuponesPorPagina = 12;
  hayMasPaginas = true;

  constructor(private gestionCuponesService: GestionCuponesService) {}

  ngOnInit() {
    // Cargar los cupones
    this.cargarCupones();
  }

  trackById(index: number, item: InformacionCuponDTO) {
    return item.codigo;
  }

  seleccionar(cupon: InformacionCuponDTO, estado: boolean) {
    if (estado) {
      this.seleccionados.push(cupon);
    } else {
      this.seleccionados = this.seleccionados.filter(c => c.codigo !== cupon.codigo);
    }
    this.actualizarMensaje();
  }

  cargarCupones() {
    this.gestionCuponesService.obtenerCupones()
      .subscribe((respuesta: MensajeDTO<InformacionCuponDTO[]>) => {
        this.cupones = respuesta.respuesta;
        this.gestionCuponesService.setCupones(this.cupones);
      });
  }

  actualizarMensaje() {
    const tam = this.seleccionados.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} elemento${tam > 1 ? 's' : ''}` : '';
  }

  eliminarCupones() {
    const listaIdCupones = this.seleccionados.map(cupon => cupon.codigo);
    const eliminarCuponesDTO: EliminarCuponesDTO = { listaIdCupones };
    return this.gestionCuponesService.eliminarCupones(eliminarCuponesDTO);
  }

  eliminarCupon(cupon: InformacionCuponDTO) {
    return this.gestionCuponesService.eliminarCupon(cupon);
  }

  confirmarEliminacionCupones() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará los cupones seleccionados.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarCupones().subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cupones eliminados',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            this.seleccionados = [];
            this.actualizarMensaje();
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
            this.seleccionados = [];
            this.actualizarMensaje();
          },
        });
      }
    });
  }

  confirmarEliminacionCupon(cupon: InformacionCuponDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cupón seleccionado.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarCupon(cupon).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cupón eliminado',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }
}
