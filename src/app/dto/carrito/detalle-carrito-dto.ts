import { InformacionEventoDTO } from "../evento/informacion-evento-dto";

export interface DetalleCarritoDTO {
    cantidad: number;
    nombreLocalidad: string;
    precioLocalidad: number;
    evento: InformacionEventoDTO;
}
