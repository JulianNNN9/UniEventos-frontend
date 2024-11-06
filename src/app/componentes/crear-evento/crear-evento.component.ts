import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { CrearEventoService } from '../../servicios/crear-evento.service';
import { CrearEventoDTO } from '../../dto/evento/crear-evento-dto';
import { EditarEventoDTO } from '../../dto/evento/editar-evento-dto';
import { CommonModule } from '@angular/common';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { AdminService } from '../../servicios/admin.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificacionEventoDTO } from '../../dto/evento/notificacion-evento-dto';
import { NotificacionService } from '../../servicios/notificacion.service';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertMessagesModule,
  ],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.css',
})
export class CrearEventoComponent {
  idEvento: string;
  modoEdicion: boolean = false;
  tiposDeEvento: string[] = [];
  ciudades: string[] = [];
  estadoEventos: string[] = [];
  crearEventoForm!: FormGroup;
  imagenPortadaActualURL: string;
  imagenLocalidadesActualURL: string;
  imagenPortadaNuevaURL: string;
  imagenLocalidadesNuevaURL: string;
  editarImagenPortada: boolean = false;
  editarImagenLocalidades: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    private crearEventoService: CrearEventoService,
    private adminService: AdminService,
    private notificacionService: NotificacionService
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.cargarCiudades();
    this.cargarTiposDeEvento();
    this.cargarEstadosEventos();

    this.idEvento = this.route.snapshot.params['id'];

    if (this.idEvento) {
      this.modoEdicion = true;
      this.crearEventoService.obtenerEvento(this.idEvento).subscribe({
        next: (respuesta) => {
          if (respuesta.respuesta) {
            const evento = respuesta.respuesta;
            this.crearEventoForm.patchValue({
              nombreEvento: evento.nombreEvento,
              direccionEvento: evento.direccionEvento,
              ciudadEvento: evento.ciudadEvento,
              descripcionEvento: evento.descripcionEvento,
              tipoEvento: evento.tipoEvento,
              fechaEvento: evento.fechaEvento,
              estadoEvento: evento.estadoEvento,
              imagenPortada: evento.imagenPortada,
              imagenLocalidades: evento.imagenLocalidades,
            });
            // Inicializar el FormArray de localidades
            const localidadesArray = this.crearEventoForm.get(
              'localidades'
            ) as FormArray;
            localidadesArray.clear(); // Limpiar el array antes de agregar nuevas localidades

            evento.localidades.forEach((localidad) => {
              const localidadGroup = this.formBuilder.group({
                nombreLocalidad: [
                  localidad.nombreLocalidad,
                  Validators.required,
                ],
                precioLocalidad: [
                  localidad.precioLocalidad,
                  [Validators.required, Validators.min(0)],
                ],
                capacidadMaxima: [
                  localidad.capacidadMaxima,
                  [Validators.required, Validators.min(1)],
                ],
              });
              localidadesArray.push(localidadGroup); // Agregar la localidad al FormArray
            });
            this.imagenPortadaActualURL = evento.imagenPortada;
            this.imagenLocalidadesActualURL = evento.imagenLocalidades;
          }
        },
        error: (err) => console.error('Error al obtener el evento:', err),
      });
    }
  }

  private crearFormulario() {
    this.crearEventoForm = this.formBuilder.group({
      nombreEvento: ['', [Validators.required]],
      direccionEvento: ['', [Validators.required]],
      ciudadEvento: ['', [Validators.required]],
      descripcionEvento: ['', [Validators.required]],
      tipoEvento: ['', [Validators.required]],
      fechaEvento: ['', [Validators.required]],
      localidades: this.formBuilder.array(
        [],
        this.alMenosUnaLocalidadValidator()
      ),
      imagenPortada: ['', [Validators.required]],
      imagenLocalidades: ['', [Validators.required]],
      estadoEvento: [''],
    });
  }
  get localidades(): FormArray {
    return this.crearEventoForm.get('localidades') as FormArray;
  }

  agregarLocalidad() {
    const localidadGroup = this.formBuilder.group({
      nombreLocalidad: ['', Validators.required],
      precioLocalidad: [0, [Validators.required, Validators.min(0)]], // nuevo campo para precio
      capacidadMaxima: [0, [Validators.required, Validators.min(1)]],
    });

    // Accedemos al FormArray de localidades y le añadimos el nuevo grupo
    (this.crearEventoForm.get('localidades') as FormArray).push(localidadGroup);
  }
  eliminarTodasLocalidades() {
    this.localidades.clear();
  }

  eliminarLocalidad(index: number) {
    this.localidades.removeAt(index);
  }

  async onFileChange(event: Event, tipo: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Verificamos el tamaño del archivo en KB
      const fileSizeKB = file.size / 1024;
      let compressedFile: File;
      let imgURL: string;

      if (fileSizeKB > 50) {
        // Si el archivo es mayor a 50 KB, aplicamos compresión y obtenemos el archivo comprimido
        compressedFile = await this.compressImage(file);
        imgURL = URL.createObjectURL(compressedFile);
      } else {
        // Si el archivo es menor o igual a 50 KB, usamos el archivo original
        compressedFile = file;
        imgURL = URL.createObjectURL(file);
      }

      // Asigna la URL para vista previa y actualiza el formulario con el archivo (original o comprimido)
      if (tipo === 'portada') {
        this.imagenPortadaNuevaURL = imgURL;
        this.crearEventoForm.patchValue({ imagenPortada: compressedFile });
      } else if (tipo === 'localidades') {
        this.imagenLocalidadesNuevaURL = imgURL;
        this.crearEventoForm.patchValue({ imagenLocalidades: compressedFile });
      }
    }
  }

  // Método para comprimir la imagen y devolver el archivo comprimido
  private compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 800; // Ajusta según sea necesario
          const maxHeight = 800; // Ajusta según sea necesario

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height *= maxWidth / width;
              width = maxWidth;
            } else {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Creamos un nuevo archivo comprimido y lo resolvemos
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Error al comprimir la imagen'));
              }
            },
            'image/jpeg',
            0.7 // Nivel de compresión
          );
        };
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  cargarTiposDeEvento() {
    this.crearEventoService.listarTipoEventos().subscribe((tipos) => {
      this.tiposDeEvento = tipos.respuesta;
    });
  }

  cargarCiudades() {
    this.crearEventoService.listarCiudades().subscribe((ciudades) => {
      this.ciudades = ciudades.respuesta;
    });
  }
  cargarEstadosEventos() {
    this.crearEventoService.listarEstadoEventos().subscribe((estadoEventos) => {
      this.estadoEventos = estadoEventos.respuesta;
    });
  }

  alMenosUnaLocalidadValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const localidades = control as FormArray;
      return localidades.length > 0 ? null : { noLocalidades: true };
    };
  }

  public crearEvento() {
    const { value, valid, controls } = this.crearEventoForm;
    if (!valid) {
      // Crear un array para almacenar los campos inválidos
      const camposInvalidos = [];

      // Iterar sobre los controles del formulario
      for (const controlName in controls) {
        if (controls[controlName].invalid) {
          camposInvalidos.push(controlName);
        }
      }

      // Mostrar un mensaje de error con los campos inválidos
      this.alertMessageService.show(
        `Por favor llena el formulario correctamente. Campos inválidos: ${camposInvalidos.join(
          ', '
        )}`,
        { cssClass: 'alerts-error', timeOut: 4000 }
      );
      return;
    } else if (this.modoEdicion && !value.estadoEvento) {
      this.alertMessageService.show(
        'Por favor llena el formulario correctamente. Campos inválidos: estadoEvento',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return;
    }

    if (this.modoEdicion) {
      console.log('Hola');
      const uploadTasks: Observable<any>[] = []; // Define explícitamente como un array de observables

      if (this.editarImagenPortada && this.editarImagenLocalidades) {
        const portadaTask = this.subirImagenFirebase('imagenPortada').pipe(
          catchError((error) => {
            this.alertMessageService.show(
              'Error al subir la imagen de portada: ' + error.error.respuesta,
              { cssClass: 'alerts-error', timeOut: 3000 }
            );
            console.error(
              'Error al subir la imagen de portada:',
              error.error.respuesta
            );
            this.imagenPortadaNuevaURL = '';
            return of(null); // Continua sin detener todo el flujo
          })
        );
        uploadTasks.push(portadaTask);

        const localidadesTask = this.subirImagenFirebase(
          'imagenLocalidades'
        ).pipe(
          catchError((error) => {
            this.alertMessageService.show(
              'Error al subir la imagen de localidades: ' +
                error.error.respuesta,
              { cssClass: 'alerts-error', timeOut: 3000 }
            );
            console.error(
              'Error al subir la imagen de localidades:',
              error.error.respuesta
            );
            this.imagenLocalidadesNuevaURL = '';
            return of(null); // Continua sin detener todo el flujo
          })
        );
        uploadTasks.push(localidadesTask);

        forkJoin(uploadTasks).subscribe({
          next: (results) => {
            // Procesa las URLs de las imágenes subidas
            if (results[0]) {
              this.imagenPortadaNuevaURL = results[0]?.respuesta;
            }
            if (results[1]) {
              this.imagenLocalidadesNuevaURL = results[1]?.respuesta;
            }
            value.imagenPortada = this.imagenPortadaNuevaURL;
            value.imagenLocalidades = this.imagenLocalidadesNuevaURL;

            if (this.imagenPortadaActualURL != '') {
              this.eliminarImagenFirebase('portada');
            }
            if (this.imagenLocalidadesActualURL != '') {
              this.eliminarImagenFirebase('localidades');
            }
            const eventoAEditar: EditarEventoDTO = {
              idEvento: this.idEvento,
              nombreEvento: value.nombreEvento,
              direccionEvento: value.direccionEvento,
              ciudadEvento: value.ciudadEvento,
              descripcionEvento: value.descripcionEvento,
              tipoEvento: value.tipoEvento,
              fechaEvento: value.fechaEvento,
              localidades: value.localidades,
              imagenPortada: value.imagenPortada,
              imagenLocalidades: value.imagenLocalidades,
              estadoEvento: value.estadoEvento,
            };

            this.crearEventoService.editarEvento(eventoAEditar).subscribe({
              next: (data) => {
                Swal.fire({
                  title: 'Evento Editado',
                  text: data.respuesta,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
              },
              error: (error) => {
                Swal.fire({
                  title: 'Error',
                  text: error.error.respuesta,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              },
            });
          },
          error: (error) => {
            this.alertMessageService.show('Error: ' + error.error.respuesta, {
              cssClass: 'alerts-error',
              timeOut: 3000,
            });
          },
        });
      }else if(this.editarImagenPortada){
        const portadaTask = this.subirImagenFirebase('imagenPortada').pipe(
          catchError((error) => {
            this.alertMessageService.show(
              'Error al subir la imagen de portada: ' + error.error.respuesta,
              { cssClass: 'alerts-error', timeOut: 3000 }
            );
            console.error(
              'Error al subir la imagen de portada:',
              error.error.respuesta
            );
            return of(null); // Continua sin detener todo el flujo
          })
        );
        uploadTasks.push(portadaTask);

        forkJoin(uploadTasks).subscribe({
          next: (results) => {
            // Procesa las URLs de las imágenes subidas
            if (results[0]) {
              this.imagenPortadaNuevaURL = results[0]?.respuesta;
            }
            value.imagenPortada = this.imagenPortadaNuevaURL;
            value.imagenLocalidades = this.imagenLocalidadesActualURL;

            if (this.imagenPortadaActualURL != '') {
              this.eliminarImagenFirebase('portada');
            }

            const eventoAEditar: EditarEventoDTO = {
              idEvento: this.idEvento,
              nombreEvento: value.nombreEvento,
              direccionEvento: value.direccionEvento,
              ciudadEvento: value.ciudadEvento,
              descripcionEvento: value.descripcionEvento,
              tipoEvento: value.tipoEvento,
              fechaEvento: value.fechaEvento,
              localidades: value.localidades,
              imagenPortada: value.imagenPortada,
              imagenLocalidades: value.imagenLocalidades,
              estadoEvento: value.estadoEvento,
            };

            this.crearEventoService.editarEvento(eventoAEditar).subscribe({
              next: (data) => {
                Swal.fire({
                  title: 'Evento Editado',
                  text: data.respuesta,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
              },
              error: (error) => {
                Swal.fire({
                  title: 'Error',
                  text: error.error.respuesta,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              },
            });
          },
          error: (error) => {
            this.alertMessageService.show('Error: ' + error.error.respuesta, {
              cssClass: 'alerts-error',
              timeOut: 3000,
            });
          },
        });
      }else if(this.editarImagenLocalidades){

        const localidadesTask = this.subirImagenFirebase(
          'imagenLocalidades'
        ).pipe(
          catchError((error) => {
            this.alertMessageService.show(
              'Error al subir la imagen de localidades: ' +
                error.error.respuesta,
              { cssClass: 'alerts-error', timeOut: 3000 }
            );
            console.error(
              'Error al subir la imagen de localidades:',
              error.error.respuesta
            );
            this.imagenLocalidadesNuevaURL = '';
            return of(null); // Continua sin detener todo el flujo
          })
        );
        uploadTasks.push(localidadesTask);

        forkJoin(uploadTasks).subscribe({
          next: (results) => {
            // Procesa las URLs de las imágenes subidas
            if (results[0]) {
              this.imagenLocalidadesNuevaURL = results[0]?.respuesta;
            }
            value.imagenPortada = this.imagenPortadaActualURL;
            value.imagenLocalidades = this.imagenLocalidadesNuevaURL;

            if (this.imagenLocalidadesActualURL != '') {
              this.eliminarImagenFirebase('localidades');
            }

            const eventoAEditar: EditarEventoDTO = {
              idEvento: this.idEvento,
              nombreEvento: value.nombreEvento,
              direccionEvento: value.direccionEvento,
              ciudadEvento: value.ciudadEvento,
              descripcionEvento: value.descripcionEvento,
              tipoEvento: value.tipoEvento,
              fechaEvento: value.fechaEvento,
              localidades: value.localidades,
              imagenPortada: value.imagenPortada,
              imagenLocalidades: value.imagenLocalidades,
              estadoEvento: value.estadoEvento,
            };

            this.crearEventoService.editarEvento(eventoAEditar).subscribe({
              next: (data) => {
                Swal.fire({
                  title: 'Evento Editado',
                  text: data.respuesta,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                });
              },
              error: (error) => {
                Swal.fire({
                  title: 'Error',
                  text: error.error.respuesta,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                });
              },
            });
          },
          error: (error) => {
            this.alertMessageService.show('Error: ' + error.error.respuesta, {
              cssClass: 'alerts-error',
              timeOut: 3000,
            });
          },
        });
      }else{
        value.imagenPortada = this.imagenPortadaActualURL;
        value.imagenLocalidades = this.imagenLocalidadesActualURL;

        const eventoAEditar: EditarEventoDTO = {
          idEvento: this.idEvento,
          nombreEvento: value.nombreEvento,
          direccionEvento: value.direccionEvento,
          ciudadEvento: value.ciudadEvento,
          descripcionEvento: value.descripcionEvento,
          tipoEvento: value.tipoEvento,
          fechaEvento: value.fechaEvento,
          localidades: value.localidades,
          imagenPortada: value.imagenPortada,
          imagenLocalidades: value.imagenLocalidades,
          estadoEvento: value.estadoEvento,
        };

        this.crearEventoService.editarEvento(eventoAEditar).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Evento Editado',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta,
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    } else {
      const uploadTasks: Observable<any>[] = []; // Define explícitamente como un array de observables

      const portadaTask = this.subirImagenFirebase('imagenPortada').pipe(
        catchError((error) => {
          this.alertMessageService.show(
            'Error al subir la imagen de portada: ' + error.error.respuesta,
            { cssClass: 'alerts-error', timeOut: 3000 }
          );
          console.error(
            'Error al subir la imagen de portada:',
            error.error.respuesta
          );
          this.imagenPortadaNuevaURL = '';
          return of(null); // Continua sin detener todo el flujo
        })
      );
      uploadTasks.push(portadaTask);

      const localidadesTask = this.subirImagenFirebase(
        'imagenLocalidades'
      ).pipe(
        catchError((error) => {
          this.alertMessageService.show(
            'Error al subir la imagen de localidades: ' + error.error.respuesta,
            { cssClass: 'alerts-error', timeOut: 3000 }
          );
          console.error(
            'Error al subir la imagen de localidades:',
            error.error.respuesta
          );
          this.imagenLocalidadesNuevaURL = '';
          return of(null); // Continua sin detener todo el flujo
        })
      );
      uploadTasks.push(localidadesTask);

      // Usa forkJoin para esperar que todas las subidas se completen
      forkJoin(uploadTasks).subscribe({
        next: (results) => {
          // Procesa las URLs de las imágenes subidas
          if (results[0]) {
            this.imagenPortadaNuevaURL = results[0]?.respuesta;
          }
          if (results[1]) {
            this.imagenLocalidadesNuevaURL = results[1]?.respuesta;
          }

          value.imagenPortada = this.imagenPortadaNuevaURL;
          value.imagenLocalidades = this.imagenLocalidadesNuevaURL;

          const eventoCrear: CrearEventoDTO = {
            nombreEvento: value.nombreEvento,
            direccionEvento: value.direccionEvento,
            ciudadEvento: value.ciudadEvento,
            descripcionEvento: value.descripcionEvento,
            tipoEvento: value.tipoEvento,
            fechaEvento: value.fechaEvento,
            localidades: value.localidades,
            imagenPortada: value.imagenPortada,
            imagenLocalidades: value.imagenLocalidades,
          };

          this.crearEventoService.crearEvento(eventoCrear).subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Evento Creado',
                text: data.respuesta,
                icon: 'success',
                confirmButtonText: 'Aceptar',
              });
              const eventoNotificacion: NotificacionEventoDTO = {
                _id: data.respuesta,
                nombreEvento: value.nombreEvento,
                fechaEvento: value.fechaEvento,
                descripcionEvento: value.descripcionEvento,
                ciudadEvento: value.ciudadEvento,
                imagenPortada: value.imagenPortada
              };
              this.notificacionService.agregarNotificaion(eventoNotificacion);
              this.crearEventoForm.reset();
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error.error.respuesta,
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
            },
          });
        },
        error: (error) => {
          this.alertMessageService.show('Error: ' + error.error.respuesta, {
            cssClass: 'alerts-error',
            timeOut: 3000,
          });
        },
      });
    }
  }

  private subirImagenFirebase(campo: string): Observable<MensajeDTO<string>> {
    const archivo = this.crearEventoForm.get(campo)?.value;
    return this.adminService.subirImagen(archivo);
  }

  eliminarImagenFirebase(tipo: string) {
    if (tipo === 'portada') {
      this.adminService.eliminarImagen(this.imagenPortadaActualURL).subscribe({
        next: () => console.log('Imagen eliminada correctamente de Firebase'),
        error: (err) => console.error('Error al eliminar la imagen:', err),
      });
      this.imagenPortadaActualURL = '';
      this.crearEventoForm.patchValue({ imagenPortada: '' });
    } else if (tipo === 'localidades') {
      this.adminService
        .eliminarImagen(this.imagenLocalidadesActualURL)
        .subscribe({
          next: () => console.log('Imagen eliminada correctamente de Firebase'),
          error: (err) => console.error('Error al eliminar la imagen:', err),
        });
      this.imagenLocalidadesActualURL = '';
      this.crearEventoForm.patchValue({ imagenLocalidades: '' });

    }
  }
  toggleEditarImagenPortada() {
    this.editarImagenPortada = !this.editarImagenPortada;
  }

  toggleEditarImagenLocalidades() {
    this.editarImagenLocalidades = !this.editarImagenLocalidades;
  }
}
