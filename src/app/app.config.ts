import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AlertMessagesService } from 'jjwins-angular-alert-messages'

import { routes } from './app.routes';
import { EventosService } from './servicios/eventos.service';
import { TokenService } from './servicios/token.service';
import { AdminService } from './servicios/admin.service';
import { PublicoService } from './servicios/publico.service';
import { ClienteService } from './servicios/cliente.service';
import { AuthAdminGuard } from './guardianes/auth-admin.guard';
import { AuthClienteGuard } from './guardianes/auth-cliente.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    EventosService,
    TokenService,
    AdminService,
    PublicoService,
    ClienteService,
    AlertMessagesService,
    AuthAdminGuard,
    AuthClienteGuard
  ]
};
