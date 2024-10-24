import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FooterComponent, HeaderComponent],
  templateUrl: './app-component.component.html',
  styleUrl: './app-component.component.css'
})
export class AppComponentComponent {
  footer: String="Universidad del Quindío - 2024-2";
  title: String="Página Inicial de Unieventos";
}
