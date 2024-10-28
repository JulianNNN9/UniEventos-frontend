import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { GestionEventosComponent } from './componentes/gestion-eventos/gestion-eventos.component';
import { DetalleEventoComponent } from './componentes/detalle-evento/detalle-evento.component';
import { CarritoComprasComponent } from './componentes/carrito-compras/carrito-compras.component';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'crear-evento', component: CrearEventoComponent},
   { path: 'header', component: HeaderComponent},
   { path: 'footer', component: FooterComponent},
   { path: "gestion-eventos", component: GestionEventosComponent },
   { path: 'detalle-evento/:id', component: DetalleEventoComponent },
   { path: 'editar-evento/:id', component: CrearEventoComponent },
   { path: 'carrito-compras', component: CarritoComprasComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
