export interface InformacionEventoDTO {
  nombreEvento: string;
  direccionEvento: string;
  ciudadEvento: string;
  descripcionEvento: string;
  fechaEvento: string; // Usamos string para representar la fecha en formato ISO
  localidades: any[]; // Todo: Definir tipo de dato
  estadoEvento: any; // Todo: Definir tipo de dato
}

