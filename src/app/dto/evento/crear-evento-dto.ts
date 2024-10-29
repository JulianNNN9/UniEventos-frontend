export interface CrearEventoDTO {
  nombreEvento: string;
  direccionEvento: string;
  ciudadEvento: string;
  descripcionEvento: string;
  tipoEvento: any; // Todo: Definir tipo de dato
  fechaEvento: string; // Usamos string para representar la fecha en formato ISO
  localidades: any[]; // Todo: Definir tipo de dato
  imagenPortada: string;
  imagenLocalidades: string;
}


