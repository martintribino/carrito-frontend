import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CarritoResponse, ProductoResponse } from '../models/carrito.models';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  constructor(private api: ApiService) {}

  crearCarrito(dni: string): Observable<CarritoResponse> {
    return this.api.post<CarritoResponse>(`carritos?dni=${dni}`, null);
  }

  eliminarCarrito(carritoId: number): Observable<void> {
    return this.api.delete<void>(`carritos/${carritoId}`);
  }

  consultarCarrito(carritoId: number): Observable<CarritoResponse> {
    return this.api.get<CarritoResponse>(`carritos/${carritoId}`);
  }

  agregarProducto(carritoId: number, productoId: number): Observable<CarritoResponse> {
    return this.api.post<CarritoResponse>(`carritos/${carritoId}/productos/${productoId}`, null);
  }

  eliminarProducto(carritoId: number, productoId: number): Observable<CarritoResponse> {
    return this.api.delete<CarritoResponse>(`carritos/${carritoId}/productos/${productoId}`);
  }

  top4ProductosMasCaros(dni: string): Observable<ProductoResponse[]> {
    return this.api.get<ProductoResponse[]>(`reportes/productos-mas-caros?dni=${dni}`);
  }
}
