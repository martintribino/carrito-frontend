import { Injectable, signal, computed } from '@angular/core';
import { CarritoResponse } from '../models/carrito.models';

@Injectable({ providedIn: 'root' })
export class CarritoStateService {
  private _carrito = signal<CarritoResponse | null>(null);

  carrito = this._carrito.asReadonly();
  carritoId = computed(() => this._carrito()?.id ?? null);
  tieneItems = computed(() => (this._carrito()?.items?.length ?? 0) > 0);
  cantidadTotal = computed(() => this._carrito()?.cantidadItems ?? 0);

  setCarrito(c: CarritoResponse | null) {
    this._carrito.set(c);
  }
}
