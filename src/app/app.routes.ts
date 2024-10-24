import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'eventos/crear-evento', component: CrearEventoComponent},
   { path: 'header', component: HeaderComponent},
   { path: 'footer', component: FooterComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
