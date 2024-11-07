import { InformacionItemCompraDTO } from "./informacion-item-compra-dto";

export interface InformacionCompraDTO {
    id: string;
    idUsuario: string;
    informacionItemCompraDTOS: InformacionItemCompraDTO[];
    total: number;
    fechaCompra: string;  // En Angular, podemos usar Date para manejar LocalDateTime de Java
    codigoCupon: string;
    estadoCompra: any;
    codigoPasarela: string;
    pago: any;
}
