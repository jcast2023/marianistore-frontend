// src/app/models/pedido-dto.ts (crear o actualizar)
import { DireccionDTO } from './direccion-dto';

export interface ItemPedidoDTO {
  idItemPedido?: number;
  idPedido?: number;
  idProducto: number;
  nombreProducto?: string;
  cantidad: number;
  precioUnitario: number;
  imagen?: string;
}

export interface PedidoDTO {
  idPedido?: number;
  idUsuario: number;
  emailUsuario?: string;
  fechaPedido: string;
  total: number;
  estado: string;
  items: ItemPedidoDTO[];
  direccionEnvio?: DireccionDTO;  // ← AGREGAR
  idDireccionEnvio?: number;      // ← AGREGAR
}
