import { InformacionDetalleCarritoDTO } from "./informacion-detalle-carrito-dto";

export interface AgregarItemDTO {
  idCarrito:string,
  informacionDetalleCarrito: InformacionDetalleCarritoDTO; //Todo: Definir tipo de dato para detalleCarrito
}
