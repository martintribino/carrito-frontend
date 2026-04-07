export type TipoCarrito = 'COMUN' | 'PROMOCIONAL_FECHA_ESPECIAL' | 'PROMOCIONAL_VIP';

export interface ItemResponse {
  productoId: number;
  productoNombre: string;
  precioUnitario: number;
}

export interface CarritoResponse {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  tipo: TipoCarrito;
  items: ItemResponse[];
  cantidadItems: number;
  subtotal: number;
  descuento: number;
  total: number;
  descripcionDescuento: string;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  precio: number;
}
