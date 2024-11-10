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
import { AuthAdminGuard } from './guardianes/auth-admin.guard';
import { AuthClienteGuard } from './guardianes/auth-cliente.guard';
import { EditarCuentaComponent } from './componentes/editar-cuenta/editar-cuenta.component';
import { CambiarContraseniaComponent } from './componentes/cambiar-contrasenia/cambiar-contrasenia.component';
import { ActivarCuentaComponent } from './componentes/activar-cuenta/activar-cuenta.component';
import { DetalleCompraComponent } from './componentes/detalle-compra/detalle-compra.component';
import { GestionCuponesComponent } from './componentes/gestion-cupones/gestion-cupones.component';
import { CrearCuponComponent } from './componentes/crear-cupon/crear-cupon.component';
import { HistorialComprasComponent } from './componentes/historial-compras/historial-compras.component';
import { OlvidarContraseniaComponent } from './componentes/olvidar-contrasenia/olvidar-contrasenia.component';
import { LoginGuard } from './guardianes/login.guard';
import { AuthAdminClienteGuard } from './guardianes/auth-admin-cliente.guard';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
   { path: 'activar-cuenta', component: ActivarCuentaComponent, canActivate: [LoginGuard] },
   { path: 'registro', component: RegistroComponent , canActivate: [LoginGuard]},
   { path: 'crear-evento', component: CrearEventoComponent, canActivate: [AuthAdminGuard] },
   { path: 'header', component: HeaderComponent},
   { path: 'footer', component: FooterComponent},
   { path: "gestion-eventos", component: GestionEventosComponent, canActivate: [AuthAdminGuard] },
   { path: 'detalle-evento/:id', component: DetalleEventoComponent },
   { path: 'editar-evento/:id', component: CrearEventoComponent, canActivate: [AuthAdminGuard] },
   { path: "gestion-cupones", component: GestionCuponesComponent, canActivate: [AuthAdminGuard]},
   { path: 'crear-cupon', component: CrearCuponComponent, canActivate: [AuthAdminGuard]},
   { path: 'editar-cupon/:id', component: CrearCuponComponent, canActivate: [AuthAdminGuard]},
   { path: 'carrito-compras', component: CarritoComprasComponent},
   { path: 'detalle-compra/:id', component: DetalleCompraComponent, canActivate: [AuthClienteGuard] },
   { path: 'historial-compras', component: HistorialComprasComponent, canActivate: [AuthClienteGuard] },
   { path: 'editar-cuenta/:id', component: EditarCuentaComponent, canActivate: [AuthAdminClienteGuard]},
   { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent, canActivate: [AuthAdminClienteGuard]},
   { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent, canActivate: [LoginGuard]},
   { path: "**", pathMatch: "full", redirectTo: "" }
];
