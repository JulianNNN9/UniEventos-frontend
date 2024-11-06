export interface ItemEventoDTO {
  id: string;
  nombreEvento: string;
  direccionEvento: string;
  ciudadEvento: string;
  fechaEvento: Date; // Usamos string para representar la fecha en formato ISO
  imagenPortada: string;
}
