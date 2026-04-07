import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../core/services/carrito.service';
import { CarritoResponse } from '../../core/models/carrito.models';

const PRODUCTOS = [
  { id: 1, nombre: 'Notebook Lenovo', precio: 850000 },
  { id: 2, nombre: 'Mouse Logitech', precio: 15000 },
  { id: 3, nombre: 'Teclado Mecánico', precio: 45000 },
  { id: 4, nombre: 'Monitor 24"', precio: 320000 },
  { id: 5, nombre: 'Auriculares Sony', precio: 75000 },
  { id: 6, nombre: 'Webcam Full HD', precio: 38000 },
  { id: 7, nombre: 'Hub USB', precio: 12000 },
  { id: 8, nombre: 'Pad Mouse XL', precio: 8000 },
  { id: 9, nombre: 'Cable HDMI 2m', precio: 5000 },
  { id: 10, nombre: 'Silla Gamer', precio: 195000 },
];

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  dni = '';
  carrito: CarritoResponse | null = null;
  productos = PRODUCTOS;
  error = '';
  loading = false;

  constructor(private carritoService: CarritoService) {}

  crearCarrito() {
    if (!this.dni.trim()) return;
    this.loading = true;
    this.error = '';
    this.carritoService.crearCarrito(this.dni.trim()).subscribe({
      next: c => { this.carrito = c; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Error al crear carrito'; this.loading = false; }
    });
  }

  agregarProducto(productoId: number) {
    if (!this.carrito) return;
    this.error = '';
    this.carritoService.agregarProducto(this.carrito.id, productoId).subscribe({
      next: c => this.carrito = c,
      error: e => this.error = e.error?.message || 'Error al agregar producto'
    });
  }

  eliminarProducto(productoId: number) {
    if (!this.carrito) return;
    this.error = '';
    this.carritoService.eliminarProducto(this.carrito.id, productoId).subscribe({
      next: c => this.carrito = c,
      error: e => this.error = e.error?.message || 'Error al eliminar producto'
    });
  }

  eliminarCarrito() {
    if (!this.carrito) return;
    this.error = '';
    this.carritoService.eliminarCarrito(this.carrito.id).subscribe({
      next: () => this.carrito = null,
      error: e => this.error = e.error?.message || 'Error al eliminar carrito'
    });
  }

  consultarCarrito() {
    if (!this.carrito) return;
    this.carritoService.consultarCarrito(this.carrito.id).subscribe({
      next: c => this.carrito = c,
      error: e => this.error = e.error?.message || 'Error al consultar carrito'
    });
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      'COMUN': 'Común',
      'PROMOCIONAL_FECHA_ESPECIAL': 'Promocional Fecha Especial',
      'PROMOCIONAL_VIP': 'Promocional VIP'
    };
    return map[tipo] || tipo;
  }
}
