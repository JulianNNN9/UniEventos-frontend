import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app-component.component.html',
  styleUrl: './app-component.component.css'
})
export class AppComponentComponent {
  footer: String="Universidad del Quindío - 2024-2";
  title: String="Página Inicial de Unieventos";
}
