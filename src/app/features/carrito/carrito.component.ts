import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarritoService } from '../../core/services/carrito.service';
import { CarritoStateService } from '../../core/services/carrito-state.service';
import { CarritoResponse } from '../../core/models/carrito.models';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  error = '';
  comprando = false;
  compraExitosa = false;
  productosStock: Map<number, number> = new Map();

  get carrito(): CarritoResponse | null { return this.state.carrito(); }

  constructor(
    private carritoService: CarritoService,
    private state: CarritoStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarStock();
  }

  cargarStock() {
    this.carritoService.listarProductos().subscribe({
      next: productos => {
        this.productosStock.clear();
        productos.forEach(p => this.productosStock.set(p.id, p.stock));
      }
    });
  }

  getStockDisponible(productoId: number): number {
    return this.productosStock.get(productoId) ?? 0;
  }

  cambiarCantidad(productoId: number, nuevaCantidad: number) {
    if (!this.carrito) return;
    this.error = '';
    if (nuevaCantidad <= 0) {
      this.carritoService.eliminarProducto(this.carrito.id, productoId).subscribe({
        next: c => { this.state.setCarrito(c); this.cargarStock(); this.checkVacio(c); },
        error: e => this.error = e.error?.error || 'Error'
      });
    } else {
      this.carritoService.actualizarCantidad(this.carrito.id, productoId, nuevaCantidad).subscribe({
        next: c => { this.state.setCarrito(c); this.cargarStock(); },
        error: e => this.error = e.error?.error || 'Error'
      });
    }
  }

  eliminarProducto(productoId: number) {
    if (!this.carrito) return;
    this.error = '';
    this.carritoService.eliminarProducto(this.carrito.id, productoId).subscribe({
      next: c => { this.state.setCarrito(c); this.cargarStock(); this.checkVacio(c); },
      error: e => this.error = e.error?.error || 'Error al eliminar producto'
    });
  }

  eliminarCarrito() {
    if (!this.carrito) return;
    this.error = '';
    this.carritoService.eliminarCarrito(this.carrito.id).subscribe({
      next: () => { this.state.setCarrito(null); this.router.navigate(['/store']); },
      error: e => this.error = e.error?.error || 'Error al eliminar carrito'
    });
  }

  confirmarCompra() {
    if (!this.carrito) return;
    this.error = '';
    this.comprando = true;
    this.carritoService.confirmarCompra(this.carrito.id).subscribe({
      next: () => {
        this.comprando = false;
        this.compraExitosa = true;
        this.state.setCarrito(null);
      },
      error: e => { this.error = e.error?.error || 'Error al confirmar compra'; this.comprando = false; }
    });
  }

  consultarCarrito() {
    if (!this.carrito) return;
    this.carritoService.consultarCarrito(this.carrito.id).subscribe({
      next: c => { this.state.setCarrito(c); this.cargarStock(); },
      error: e => this.error = e.error?.error || 'Error al consultar carrito'
    });
  }

  volverATienda() {
    this.router.navigate(['/store']);
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      'COMUN': 'Común',
      'PROMOCIONAL_FECHA_ESPECIAL': 'Promocional Fecha Especial',
      'PROMOCIONAL_VIP': 'Promocional VIP'
    };
    return map[tipo] || tipo;
  }

  private checkVacio(c: CarritoResponse) {
    if (c.items.length === 0) this.router.navigate(['/store']);
  }
}
