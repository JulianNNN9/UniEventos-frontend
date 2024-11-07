import { LocalidadDTO } from "./localidad-dto";

export interface InformacionEventoDTO {
  id: string;
  nombreEvento: string;
  direccionEvento: string;
  ciudadEvento: string;
  descripcionEvento: string;
  tipoEvento: string;
  fechaEvento: string; // Usamos string para representar la fecha en formato ISO
  localidades: LocalidadDTO[];
  imagenPortada: string;
  imagenLocalidades: string; // Todo: Definir tipo de dato
  estadoEvento: string; // Todo: Definir tipo de dato
}

