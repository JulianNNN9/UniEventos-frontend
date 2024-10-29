import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { EventosService } from '../../servicios/eventos.service';
import { ActivatedRoute } from '@angular/router';
import { EventoDTO } from '../../dto/evento/evento-dto';

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
  eventoEdicion?: EventoDTO;
  codigoEvento: string;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private eventosService: EventosService) {
    this.codigoEvento = '';
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.eventoEdicion = this.eventosService.obtener(this.codigoEvento);
    });

   this.crearFormulario();
   this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
  }

  private crearFormulario() {
    this.crearEventoForm = this.formBuilder.group({
      nombre: [this.eventoEdicion ? this.eventoEdicion.nombre : '', [Validators.required]],
      descripcion: [this.eventoEdicion ? this.eventoEdicion.descripcion : '', [Validators.required]],
      tipo: [this.eventoEdicion ? this.eventoEdicion.tipo : '', [Validators.required]],
      direccion: [this.eventoEdicion ? this.eventoEdicion.direccion : '', [Validators.required]],
      ciudad: [this.eventoEdicion ? this.eventoEdicion.ciudad : '', [Validators.required]],
      localidades: this.formBuilder.array(this.eventoEdicion ? this.eventoEdicion.localidades : []),
      imagenPortada: [this.eventoEdicion ? this.eventoEdicion.imagenPortada : '', [Validators.required]],
      imagenLocalidades: [this.eventoEdicion ? this.eventoEdicion.imagenLocalidades : '', [Validators.required]]
   });
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

   public crearEvento() {
    if (this.eventoEdicion) {
      // Actualizar evento existente
      this.eventosService.editar(this.codigoEvento ,this.crearEventoForm.value as EventoDTO);
      Swal.fire("Exito!", "Se ha actualizado el evento.", "success");
    } else {
      // Crear nuevo evento
      this.eventosService.crear(this.crearEventoForm.value as EventoDTO);
      Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
    }
  }


}
