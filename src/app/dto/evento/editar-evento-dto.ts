export interface EditarEventoDTO {
  idEvento: string;
  nombreEvento: string;
  direccionEvento: string;
  ciudadEvento: string;
  descripcionEvento: string;
  tipoEvento: string;
  fechaEvento: string; // Usamos string para representar la fecha en formato ISO
  localidades: any[]; // Todo: Definir tipo de dato
  imagenPortada: string;
  imagenLocalidades: string;
  estadoEvento: any; //Todo: Definir tipo de dato
}

