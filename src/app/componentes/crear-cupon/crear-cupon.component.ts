import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { CrearCuponService } from '../../servicios/crear-cupon.service';
import { ActivatedRoute } from '@angular/router';
import { EditarCuponDTO } from '../../dto/cupon/editar-cupon-dto';
import Swal from 'sweetalert2';
import { CrearCuponDTO } from '../../dto/cupon/crear-cupon-dto';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertMessagesModule,
  ],
  templateUrl: './crear-cupon.component.html',
  styleUrl: './crear-cupon.component.css',
})
export class CrearCuponComponent {
  idCupon: string;
  modoEdicion: boolean = false;
  tiposCupon: string[] = [];
  estadosCupon: string[] = [];
  crearCuponForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private crearCuponService: CrearCuponService,
    private fb: FormBuilder,
    private alertMessageService: AlertMessagesService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.cargarEstadosCupones();
    this.cargarTiposCupon();

    this.idCupon = this.route.snapshot.params['id'];

    if (this.idCupon) {
      this.modoEdicion = true;
      this.crearCuponService.obtenerCupon(this.idCupon).subscribe({
        next: (respuesta) => {
          if (respuesta.respuesta) {
            const cupon = respuesta.respuesta;
            this.crearCuponForm.patchValue({
              codigo: cupon.codigo,
              nombre: cupon.nombre,
              porcentajeDescuento: cupon.porcentajeDescuento,
              estadoCupon: cupon.estadoCupon,
              tipoCupon: cupon.tipoCupon,
              fechaVencimiento: cupon.fechaVencimiento
            });
          }
        },
        error: (err) => console.error('Error al obtener el cupon:', err),
      });
    }
  }

  crearFormulario() {
    this.crearCuponForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(5)]],
      nombre: ['', Validators.required],
      porcentajeDescuento: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      estadoCupon: [''],
      tipoCupon: ['', [Validators.required]],
      fechaVencimiento: ['', Validators.required],
    });
  }
  cargarTiposCupon() {
    this.crearCuponService.listarTipoCupones().subscribe((tipos) => {
      this.tiposCupon = tipos.respuesta;
    });
  }

  cargarEstadosCupones() {
    this.crearCuponService.listarEstadoCupones().subscribe((estadosCupon) => {
      this.estadosCupon = estadosCupon.respuesta;
    });
  }
  public crearCupon() {
    const { value, valid, controls } = this.crearCuponForm;
    if (!valid) {
      return;
    } else if (this.modoEdicion && !value.estadoCupon) {
      this.alertMessageService.show(
        'Por favor llena el formulario correctamente. Campos inválidos: estadoEvento',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return;
    }

    if (this.modoEdicion) {

      const cupoAEditar: EditarCuponDTO = {
        id: this.idCupon,
        codigo: value.codigo,
        nombre: value.nombre,
        porcentajeDescuento: value.porcentajeDescuento,
        estadoCupon: value.estadoCupon,
        tipoCupon: value.tipoCupon,
        fechaVencimiento: value.fechaVencimiento,
      };

      this.crearCuponService.editarCupon(cupoAEditar).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cupón Editado',
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
    }else{
      
      const crearCupon: CrearCuponDTO = {
        codigo: value.codigo,
        nombre: value.nombre,
        porcentajeDescuento: value.porcentajeDescuento,
        tipoCupon: value.tipoCupon,
        fechaVencimiento: value.fechaVencimiento,
      };

      this.crearCuponService.crearCupon(crearCupon).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cupón Creado',
            text: data.respuesta,
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.crearCuponForm.reset();
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
  }
}
