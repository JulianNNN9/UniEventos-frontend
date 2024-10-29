export interface InformacionCompraDTO {
    id: string;
    idUsuario: string;
    itemsCompra: any[];
    total: number;
    fechaCompra: Date;  // En Angular, podemos usar Date para manejar LocalDateTime de Java
    codigoCupon: string;
    estadoCompra: any;
    codigoPasarela: string;
    pago: any;
}
