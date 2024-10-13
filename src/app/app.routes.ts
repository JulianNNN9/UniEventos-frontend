import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';


export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: '/api/publico/iniciar-sesion', component: LoginComponent },
   { path: '/api/publico//crear-usuario', component: RegistroComponent },
   { path: '/api/admin/eventos/crear-evento', component: CrearEventoComponent}
   { path: "**", pathMatch: "full", redirectTo: "" }
];