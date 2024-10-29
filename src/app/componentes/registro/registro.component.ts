import { Component, ViewChild } from '@angular/core';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../servicios/publico.service';
import Swal from 'sweetalert2';
import { CrearUsuarioDTO } from '../../dto/crear-usuario-dto';
import { AlertMessagesService } from 'jjwins-angular-alert-messages'
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  
  cliente: CrearUsuarioDTO = {
    cedula: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    email: '',
    contrasenia: ''
  };

  @ViewChild("clienteForm") clienteForm: NgForm;

  constructor(
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService
  ) {
  }

  public registrar(clienteForm: NgForm) {
    const { value, valid } = clienteForm;

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente', 
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      this.publicoService.crearCuenta(value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cuenta creada',
            text: 'La cuenta se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
              },
        error: (error) => {
          const errores = error.error.respuesta.map((err: any) => `${err.campo}: ${err.mensaje}`).join('\n');
          Swal.fire({
            title: 'Error',
            text: errores,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
      this.clienteForm.resetForm();
    }

    this.publicoService.crearCuenta(value).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
            },
      error: (error) => {
        const errores = error.error.respuesta.map((err: any) => `${err.campo}: ${err.mensaje}`).join('\n');
        Swal.fire({
          title: 'Error',
          text: errores,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}
