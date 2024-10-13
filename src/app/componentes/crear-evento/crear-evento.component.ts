import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.css'
})
export class CrearEventoComponent {

  tiposDeEvento: string[];
  crearEventoForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
   this.crearFormulario();
   this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
  }

  private crearFormulario(){

  }

  public onFileChange(event:any, tipo:string){
    if (event.target.files.length > 0) {
      const files = event.target.files;     
   
   
      switch(tipo){
        case 'localidades':
          this.crearEventoForm.get('imagenLocalidades')?.setValue(files[0]);
          break;
        case 'portada':
          this.crearEventoForm.get('imagenPortada')?.setValue(files[0]);
          break;
      }
   
   
    }
   }
   
   public crearEvento(){
    console.log(this.crearEventoForm.value);
   }
   
  
}
