import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarritoResponse, ProductoResponse } from '../models/carrito.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  crearCarrito(dni: string): Observable<CarritoResponse> {
    return this.http.post<CarritoResponse>(`${this.baseUrl}/carritos`, { dni });
  }

  eliminarCarrito(carritoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/carritos/${carritoId}`);
  }

  consultarCarrito(carritoId: number): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(`${this.baseUrl}/carritos/${carritoId}`);
  }

  agregarProducto(carritoId: number, productoId: number): Observable<CarritoResponse> {
    return this.http.post<CarritoResponse>(`${this.baseUrl}/carritos/${carritoId}/productos/${productoId}`, null);
  }

  eliminarProducto(carritoId: number, productoId: number): Observable<CarritoResponse> {
    return this.http.delete<CarritoResponse>(`${this.baseUrl}/carritos/${carritoId}/productos/${productoId}`);
  }

  actualizarCantidad(carritoId: number, productoId: number, cantidad: number): Observable<CarritoResponse> {
    return this.http.put<CarritoResponse>(
      `${this.baseUrl}/carritos/${carritoId}/productos/${productoId}/cantidad`,
      { cantidad }
    );
  }

  carritoActivo(dni: string): Observable<CarritoResponse | null> {
    return this.http.get<CarritoResponse>(`${this.baseUrl}/carritos/activo`, {
      params: new HttpParams().set('dni', dni)
    }).pipe(
      catchError(() => of(null))
    );
  }

  confirmarCompra(carritoId: number): Observable<CarritoResponse> {
    return this.http.post<CarritoResponse>(`${this.baseUrl}/carritos/${carritoId}/comprar`, null);
  }

  listarProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}/productos`);
  }

  getFechaPromocional(): Observable<{ fechaPromocional: boolean }> {
    return this.http.get<{ fechaPromocional: boolean }>(`${this.baseUrl}/config/fecha-promocional`);
  }

  setFechaPromocional(valor: boolean): Observable<{ fechaPromocional: boolean }> {
    return this.http.put<{ fechaPromocional: boolean }>(
      `${this.baseUrl}/config/fecha-promocional`,
      { fechaPromocional: valor }
    );
  }

  top4ProductosMasCaros(dni: string): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.baseUrl}/reportes/productos-mas-caros?dni=${dni}`);
  }
}
