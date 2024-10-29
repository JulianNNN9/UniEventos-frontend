import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventoDTO } from '../../dto/evento/evento-dto';

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './carrito-compras.component.html',
  styleUrl: './carrito-compras.component.css'
})
export class CarritoComprasComponent {

  carrito: EventoDTO[] = []; // Lista de eventos en el carrito
  subtotal: number = 0; // Monto total antes de descuentos
  descuento: number = 0; // Monto de descuento aplicado
  envio: number = 0; // Costo de envío
  total: number = 0; // Monto total a pagar
  codigoCupon: string = ''; // Código de cupón ingresado por el usuario

  constructor() {
    // Inicializar carrito con algunos ejemplos (puedes cargar esto de un servicio)
    this.carrito = [
      {
        id: '1',
        nombre: 'Evento 1',
        descripcion: 'Descripción del evento 1',
        fecha: new Date('2024-12-01'),
        tipo: 'Tipo A',
        direccion: 'Dirección 1',
        ciudad: 'Ciudad 1',
        localidades: [], // Asigna valores según tu implementación
        imagenPortada: 'assets/img/image1.jpg', // Cambia por la ruta correcta
        imagenLocalidades: '',
        estado: 'Activo'
      },
      {
        id: '2',
        nombre: 'Evento 2',
        descripcion: 'Descripción del evento 2',
        fecha: new Date('2024-12-05'),
        tipo: 'Tipo B',
        direccion: 'Dirección 2',
        ciudad: 'Ciudad 2',
        localidades: [],
        imagenPortada: 'assets/img/image2.jpg', // Cambia por la ruta correcta
        imagenLocalidades: '',
        estado: 'Activo'
      }
    ];
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotal = this.carrito.length * 100; // Supongamos un precio fijo por evento para simplificar
    this.total = this.subtotal - this.descuento + this.envio;
  }

  validarCupon() {
    // Lógica para validar el código de cupón
    if (this.codigoCupon === 'DESCUENTO10') {
      this.descuento = this.subtotal * 0.10; // Aplicar un 10% de descuento
    } else {
      alert('Código de cupón inválido.');
      this.descuento = 0; // Reiniciar el descuento si el código no es válido
    }
    this.calcularTotales();
  }

  realizarPago() {
    // Lógica para manejar el pago
    alert('Pago realizado exitosamente. Gracias por tu compra!');
    // Aquí puedes agregar la lógica para integrar un servicio de pago
  }

}
