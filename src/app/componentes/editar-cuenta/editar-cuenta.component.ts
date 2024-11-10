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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { useAnimation } from '@angular/animations';
import { InformacionCarritoDTO } from '../../dto/carrito/informacion-carrito-dto';
import { InformacionUsuarioDTO } from '../../dto/cuenta/informacion-usuario-dto';
import { TokenService } from '../../servicios/token.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { AdminService } from '../../servicios/admin.service';

@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule, RouterModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrl: './editar-cuenta.component.css',
})
export class EditarCuentaComponent {
  
  usuario: InformacionUsuarioDTO;
  idUsuario: string = '';
  isAutorizado: boolean = false;
  @ViewChild("editarCuentaForm") editarCuentaForm: NgForm;

  constructor(

    private adminService: AdminService,
    private clienteService: ClienteService,
    private alertMessageService: AlertMessagesService,
    private route : ActivatedRoute,
    private tokenService: TokenService

  ) {

    this.usuario = {
      cedula: '',
      nombreCompleto: '',
      direccion: '',
      telefono: '',
      email: ''
    };
    this.route.params.subscribe((params) => {
      this.idUsuario = params['id'];
      this.obtenerUsuario();
    });

  }

  public obtenerUsuario() {
    if(this.isCliente()) {
      this.clienteService.obtenerInformacionUsuario(this.idUsuario).subscribe({
        next: (usuarioConsultado: MensajeDTO<InformacionUsuarioDTO>) => {
          if (usuarioConsultado) {
            this.usuario = {
              cedula: usuarioConsultado.respuesta.cedula,
              nombreCompleto: usuarioConsultado.respuesta.nombreCompleto,
              direccion: usuarioConsultado.respuesta.direccion,
              telefono: usuarioConsultado.respuesta.telefono,
              email: usuarioConsultado.respuesta.email
            };
            if (this.isLogged() && this.tokenService.getIDCuenta() === this.idUsuario) {
              this.isAutorizado = true;
            }
          }
        },
        error: (error) => {
          this.alertMessageService.show('Error al obtener la información del usuario', { cssClass: 'alerts-error', timeOut: 3000 });
        }
      });
    }else if(this.isAdmin()){
      this.adminService.obtenerInformacionUsuarioAdmin(this.idUsuario).subscribe({
        next: (usuarioConsultado: MensajeDTO<InformacionUsuarioDTO>) => {
          if (usuarioConsultado) {
            this.usuario = {
              cedula: usuarioConsultado.respuesta.cedula,
              nombreCompleto: usuarioConsultado.respuesta.nombreCompleto,
              direccion: usuarioConsultado.respuesta.direccion,
              telefono: usuarioConsultado.respuesta.telefono,
              email: usuarioConsultado.respuesta.email
            };
            if (this.isLogged() && this.tokenService.getIDCuenta() === this.idUsuario) {
              this.isAutorizado = true;
            }
          }
        },
        error: (error) => {
          this.alertMessageService.show('Error al obtener la información del usuario', { cssClass: 'alerts-error', timeOut: 3000 });
        }
      });
    }
}

  public editarCuenta(editarCuentaForm: NgForm) {
    const { value, valid } = editarCuentaForm;
  

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      const cuentaAEditar: EditarUsuarioDTO = {
        idUsuario: this.idUsuario,
        nombreCompleto: value.nombreCompleto,
        direccion: value.direccion,
        telefono: value.telefono
      };
      if(this.isCliente()){
        this.clienteService.editarUsuario(cuentaAEditar).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cuenta actualizada',
              text: data.respuesta,
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

      }else if(this.isAdmin()){
        this.adminService.editarUsuarioAdmin(cuentaAEditar).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cuenta actualizada',
              text: data.respuesta,
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

      }
    }
  }
  isLogged() {
    return this.tokenService.isLogged();
  }
  isCliente(){
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }
  isAdmin(){
    return this.isLogged() && this.tokenService.getRol() === 'ADMINISTRADOR';
  }
}
