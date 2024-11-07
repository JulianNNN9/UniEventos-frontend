import { InformacionDetalleCarritoDTO } from "./informacion-detalle-carrito-dto";

export interface InformacionCarritoDTO {
    id: string;
    fecha: Date;
    itemsCarrito: InformacionDetalleCarritoDTO[];
    idUsuario: string;
}
