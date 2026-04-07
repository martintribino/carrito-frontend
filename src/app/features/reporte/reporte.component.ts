import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoResponse } from '../../core/models/carrito.models';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent {
  dni = '';
  productos: ProductoResponse[] = [];
  buscado = false;
  error = '';

  constructor(private carritoService: CarritoService) {}

  buscar() {
    if (!this.dni.trim()) return;
    this.error = '';
    this.buscado = false;
    this.carritoService.top4ProductosMasCaros(this.dni.trim()).subscribe({
      next: p => { this.productos = p; this.buscado = true; },
      error: e => { this.error = e.error?.message || 'Error al buscar reporte'; this.buscado = true; }
    });
  }
}
