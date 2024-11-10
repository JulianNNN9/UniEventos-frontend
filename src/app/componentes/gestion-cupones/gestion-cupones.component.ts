import { Component } from '@angular/core';
import { CuponDTO } from '../../dto/cupon/cupon-dto';
import { GestionCuponesService } from '../../servicios/gestion-cupones.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EliminarCuponesDTO } from '../../dto/cupon/eliminar-cupones-dto';

@Component({
  selector: 'app-gestion-cupones',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './gestion-cupones.component.html',
  styleUrl: './gestion-cupones.component.css'
})
export class GestionCuponesComponent {
  cupones: CuponDTO[] = [];
  seleccionados: CuponDTO[] = [];
  textoBtnEliminar = '';

  constructor(
    private gestionCuponesService: GestionCuponesService, 
    private router: Router) {}

  ngOnInit() {
    this.cargarCuponesPaginados();
  }

  cargarCuponesPaginados() {
    this.gestionCuponesService.listarCupones()
      .subscribe((respuesta) => {
        this.cupones = respuesta.respuesta;
        this.gestionCuponesService.setCupones(this.cupones);
      });
  }

  trackById(index: number, item: CuponDTO) {
    return item.id;
  }

  seleccionar(cupon: CuponDTO, estado: boolean) {
    if (estado) {
      this.seleccionados.push(cupon);
    } else {
      this.seleccionados = this.seleccionados.filter(c => c.codigo !== cupon.codigo);
    }
    this.actualizarMensaje();
  }

  actualizarMensaje() {
    const tam = this.seleccionados.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} elemento${tam > 1 ? 's' : ''}` : '';
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
        this.eliminarCupones();
      }
    });
  }

  eliminarCupones() {
    const listaIdCupones = this.seleccionados.map(cupon => cupon.id);
    const eliminarCuponesDTO: EliminarCuponesDTO = { listaIdCupones };
    this.gestionCuponesService.eliminarCupones(eliminarCuponesDTO).subscribe({
      next: (data) => {
        Swal.fire('Eliminado', data.respuesta, 'success');
        this.seleccionados = [];
        this.actualizarMensaje();
      },
      error: (error) => {
        Swal.fire('Error', error.error.respuesta, 'error');
        this.seleccionados = [];
        this.actualizarMensaje();
      }
    });
  }

  confirmarEliminacionCupon(cupon: CuponDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cupón seleccionado.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.gestionCuponesService.eliminarCupon(cupon).subscribe({
          next: (data) => {
            Swal.fire('Eliminado', data.respuesta, 'success');
          },
          error: (error) => {
            Swal.fire('Error', error.error.respuesta, 'error');
          }
        });
      }
    });
  }
}
