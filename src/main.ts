import { bootstrapApplication } from '@angular/platform-browser';
import { InicioComponent } from "./app/componentes/inicio/inicio.component";
import { appConfig } from './app/app.config';
import { AppComponentComponent } from './app/componentes/app-component/app-component.component';

bootstrapApplication(AppComponentComponent, appConfig).catch(err => console.error(err))
