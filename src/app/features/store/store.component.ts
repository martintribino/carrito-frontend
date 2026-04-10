import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoResponse } from '../../core/models/carrito.models';
import { CarritoStateService } from '../../core/services/carrito-state.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit {
  productos: ProductoResponse[] = [];
  mensaje = '';
  esError = false;
  loading = true;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private carritoService: CarritoService,
    protected state: CarritoStateService,
    protected auth: AuthService
  ) {}

  get productosPaginados(): ProductoResponse[] {
    const start = this.pageIndex * this.pageSize;
    return this.productos.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.cargarProductos();
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  cargarProductos() {
    this.carritoService.listarProductos().subscribe({
      next: p => { this.productos = p; this.loading = false; },
      error: () => { this.setMensaje('Error al cargar productos', true); this.loading = false; }
    });
  }

  getCantidad(productoId: number): number {
    return this.state.carrito()?.items.find(i => i.productoId === productoId)?.cantidad ?? 0;
  }

  agregar(productoId: number) {
    if (!this.auth.isLoggedIn()) return;
    this.mensaje = '';
    const carritoId = this.state.carritoId();
    if (carritoId) {
      this.carritoService.agregarProducto(carritoId, productoId).subscribe({
        next: c => { this.state.setCarrito(c); this.cargarProductos(); },
        error: e => this.setMensaje(e.error?.error || 'Error al agregar producto', true)
      });
    } else {
      this.carritoService.crearCarrito(this.auth.user()!.dni).subscribe({
        next: c => {
          this.state.setCarrito(c);
          this.carritoService.agregarProducto(c.id, productoId).subscribe({
            next: c2 => { this.state.setCarrito(c2); this.cargarProductos(); },
            error: e => this.setMensaje(e.error?.error || 'Error al agregar producto', true)
          });
        },
        error: e => this.setMensaje(e.error?.error || 'Error al crear carrito', true)
      });
    }
  }

  restar(productoId: number) {
    const carritoId = this.state.carritoId();
    if (!carritoId) return;
    const cant = this.getCantidad(productoId);
    if (cant <= 1) {
      this.carritoService.eliminarProducto(carritoId, productoId).subscribe({
        next: c => { this.state.setCarrito(c); this.cargarProductos(); },
        error: e => this.setMensaje(e.error?.error || 'Error', true)
      });
    } else {
      this.carritoService.actualizarCantidad(carritoId, productoId, cant - 1).subscribe({
        next: c => { this.state.setCarrito(c); this.cargarProductos(); },
        error: e => this.setMensaje(e.error?.error || 'Error', true)
      });
    }
  }

  private setMensaje(msg: string, error: boolean) {
    this.mensaje = msg;
    this.esError = error;
  }
}
