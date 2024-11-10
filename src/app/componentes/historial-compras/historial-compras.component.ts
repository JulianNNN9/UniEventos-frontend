import { Component } from '@angular/core';
import { InformacionCompraDTO } from '../../dto/compra/informacion-compra-dto';
import { HistorialComprasService } from '../../servicios/historial-compra.service';
import { Router, RouterModule } from '@angular/router';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventosService } from '../../servicios/eventos.service';
import { InformacionEventoDTO } from '../../dto/evento/informacion-evento-dto';

@Component({
  selector: 'app-historial-compras',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, MatDividerModule, MatButtonModule, MatIconModule],
  templateUrl: './historial-compras.component.html',
  styleUrl: './historial-compras.component.css'
})
export class HistorialComprasComponent {
  compras: InformacionCompraDTO[] = [];
  imagenesEventos: { [idEvento: string]: string } = {}; // Almacenar URLs de imagen de portada por idEvento

  constructor(
    private eventoService: EventosService,
    private historialComprasService: HistorialComprasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerHistorialCompras();
  }

  obtenerHistorialCompras(): void {
    this.historialComprasService.obtenerComprasUsuario().subscribe({
      next: (compras: MensajeDTO<InformacionCompraDTO[]>) => {
        this.compras = compras.respuesta;
        this.obtenerImagenesEventos(); // Llamar al método para obtener las imágenes de portada
      },
      error: (err) => {
        console.error('Error al obtener el historial de compras:', err);
      }
    });
  }

  obtenerImagenesEventos(): void {
    this.compras.forEach(compra => {
      compra.informacionItemCompraDTOS.forEach(item => {
        if (!this.imagenesEventos[item.idEvento]) {
          this.eventoService.obtenerEvento(item.idEvento).subscribe({
            next: (evento: MensajeDTO<InformacionEventoDTO>) => {
              this.imagenesEventos[item.idEvento] = evento.respuesta.imagenPortada; // Almacenar la imagen de portada por idEvento
              console.log(evento.respuesta.imagenPortada)
            },
            error: (err) => {
              console.error(`Error al obtener la imagen del evento ${item.idEvento}`, err);
            }
          });
        }
      });
    });
  }

  verDetalle(idCompra: string): void {
    this.router.navigate(['/detalle-compra', idCompra]);
  }
}