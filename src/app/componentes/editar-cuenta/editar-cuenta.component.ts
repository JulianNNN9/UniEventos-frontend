import { Component, ViewChild, Input } from '@angular/core';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { EditarUsuarioDTO } from '../../dto/cuenta/editar-usuario-dto';
import { ClienteService } from '../../servicios/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { useAnimation } from '@angular/animations';
import { InformacionCarritoDTO } from '../../dto/carrito/informacion-carrito-dto';
import { InformacionUsuarioDTO } from '../../dto/cuenta/informacion-usuario-dto';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrl: './editar-cuenta.component.css',
})
export class EditarCuentaComponent {

  usuario: EditarUsuarioDTO;
  codigoUsuario: string = '';

  @ViewChild("editarCuentaForm") editarCuentaForm: NgForm;

  constructor(

    private clienteService: ClienteService,
    private alertMessageService: AlertMessagesService,
    private route : ActivatedRoute

  ) {

    this.usuario = {
      idUsuario: '',
      nombreCompleto: '',
      direccion: '',
      telefono: ''
    };
    this.route.params.subscribe((params) => {
      this.codigoUsuario = params['id'];
      this.obtenerUsuario();
    });

  }

  public obtenerUsuario() {
    this.clienteService.obtenerInformacionUsuario(this.codigoUsuario).subscribe({
      next: (usuarioConsultado) => {
        if (usuarioConsultado) {
          this.usuario = {
            idUsuario: this.codigoUsuario,
            nombreCompleto: usuarioConsultado.respuesta.nombreCompleto,
            direccion: usuarioConsultado.respuesta.direccion,
            telefono: usuarioConsultado.respuesta.telefono
          };
        }
      },
      error: (error) => {
        this.alertMessageService.show('Error al obtener la información del usuario', { cssClass: 'alerts-error', timeOut: 3000 });
      }
    });
}

  public editarCuenta(editarCuentaForm: NgForm) {
    const { value, valid } = editarCuentaForm;

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      this.clienteService.editarUsuario(this.usuario).subscribe({
        next: () => {
          Swal.fire({
            title: 'Cuenta actualizada',
            text: 'Los cambios se han guardado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'Hubo un error al actualizar la cuenta',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
      this.editarCuentaForm.resetForm({
        nombreCompleto: value.nombreCompleto,
        direccion: value.direccion,
        telefono: value.telefono
      });
    }
  }
}
