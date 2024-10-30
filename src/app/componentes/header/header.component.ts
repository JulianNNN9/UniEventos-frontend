import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  isLoggedIn: boolean;
  title: string = 'Unieventos'; // Declarar la variable title
  loggedInUser: string | null;
  
  constructor(
    private tokenService: TokenService
  ){
    
  }

  ngOnInit() {
    if(this.tokenService.isLogged()){
      this.loggedInUser = this.tokenService.getNombre();
    }
  }

  isAutenticado(){
    return this.tokenService.isLogged();
  }

  logout(){
    this.tokenService.logout();
  }


}
