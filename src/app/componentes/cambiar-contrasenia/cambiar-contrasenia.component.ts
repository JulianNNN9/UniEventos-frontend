import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { CambiarContraseniaDTO } from '../../dto/cuenta/cambiar-contrasenia-dto';
import { ClienteService } from '../../servicios/cliente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'],
})
export class CambiarContraseniaComponent {

  contrasenia: CambiarContraseniaDTO = {
    contraseniaAntigua: '',
    contraseniaNueva: '',
    confirmarContraseniaNueva: ''
  };

  @ViewChild('cambiarContraseniaForm') cambiarContraseniaForm: NgForm;

  constructor(
    private cuentaService: ClienteService,
    private alertMessageService: AlertMessagesService
  ) {}

  public cambiarContrasenia(cambiarContraseniaForm: NgForm) {
    const { value, valid } = cambiarContraseniaForm;

    // Validación adicional para confirmar que las contraseñas coinciden
    if (value.contraseniaNueva !== value.confirmarContraseniaNueva) {
      this.alertMessageService.show('Las contraseñas no coinciden',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return;
    }

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      this.cuentaService.cambiarContrasenia(value).subscribe({
        next: () => {
          Swal.fire({
            title: 'Contraseña actualizada',
            text: 'La contraseña ha sido cambiada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'Hubo un error al cambiar la contraseña',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
      this.cambiarContraseniaForm.resetForm();
    }
  }
}
