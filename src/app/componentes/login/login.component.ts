import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PublicoService } from '../../servicios/publico.service';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';
import { TokenService } from '../../servicios/token.service';
import { ActivarCuentaComponent } from "../activar-cuenta/activar-cuenta.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.publicoService.iniciarSesion(this.loginForm.value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Inicio de Sesión',
            text: 'Ha iniciado sesión correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              // Aquí se ejecuta el método login después de que el usuario presiona "Aceptar"
              this.tokenService.login(data.respuesta.token);
            }
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed && error.error.respuesta === 'Esta cuenta aún no ha sido activada') {
              this.router.navigate(['/activar-cuenta']);
            }
          });
        },
      });
    } else {
      this.alertMessageService.show('Formulario Inválido', {
        cssClass: 'alerts-error',
        timeOut: 3000,
      });
    }
  }
}
