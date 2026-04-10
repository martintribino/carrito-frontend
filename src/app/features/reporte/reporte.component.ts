import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductoResponse } from '../../core/models/carrito.models';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent implements OnInit {
  productos: ProductoResponse[] = [];
  error = '';
  loading = true;

  constructor(private carritoService: CarritoService, private auth: AuthService) {}

  ngOnInit() {
    const dni = this.auth.user()?.dni;
    if (!dni) return;
    this.carritoService.top4ProductosMasCaros(dni).subscribe({
      next: p => { this.productos = p; this.loading = false; },
      error: e => { this.error = e.error?.error || 'Error al cargar reporte'; this.loading = false; }
    });
  }
}
