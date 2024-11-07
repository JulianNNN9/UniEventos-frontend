import { InformacionCompraDTO } from "./informacion-compra-dto";
import { InformacionItemCompraDTO } from "./informacion-item-compra-dto";

export interface CrearCompraDTO {
  idUsuario:string,
  informacionItemCompraDTOS:InformacionItemCompraDTO[], // Todo: Definir tipo de dato para itemsCompra
  codigoCupon?:string
}
