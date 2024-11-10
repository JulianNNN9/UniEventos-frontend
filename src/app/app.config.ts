import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AlertMessagesService } from 'jjwins-angular-alert-messages'

import { routes } from './app.routes';
import { EventosService } from './servicios/eventos.service';
import { TokenService } from './servicios/token.service';
import { AdminService } from './servicios/admin.service';
import { PublicoService } from './servicios/publico.service';
import { ClienteService } from './servicios/cliente.service';
import { AuthAdminGuard } from './guardianes/auth-admin.guard';
import { AuthClienteGuard } from './guardianes/auth-cliente.guard';
import { GestionEventosService } from './servicios/gestion-eventos.service';
import { DetalleEventoService } from './servicios/detalle-evento.service';
import { CarritoService } from './servicios/carrito.service';
import { CrearEventoService } from './servicios/crear-evento.service';
import { LoginGuard } from './guardianes/login.guard';
import { usuarioInterceptor } from './interceptor/usuario.interceptor';
import { AuthService } from './servicios/auth.service';
import { NotificacionService } from './servicios/notificacion.service';
import { DetalleCompraService } from './servicios/detalle-compra.service';
import { GestionCuponesService } from './servicios/gestion-cupones.service';
import { CrearCuponService } from './servicios/crear-cupon.service';
import { HistorialComprasService } from './servicios/historial-compra.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([usuarioInterceptor])),
    EventosService,
    GestionEventosService,
    DetalleEventoService,
    CrearEventoService,
    CarritoService,
    DetalleCompraService,
    GestionCuponesService,
    CrearCuponService,
    HistorialComprasService,
    TokenService,
    AdminService,
    PublicoService,
    ClienteService,
    NotificacionService,
    AuthService,
    AlertMessagesService,
    AuthAdminGuard,
    AuthClienteGuard,
    LoginGuard, provideAnimationsAsync()
  ]
};
