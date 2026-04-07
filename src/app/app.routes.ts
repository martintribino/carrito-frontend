import { Routes } from '@angular/router';
import { CarritoComponent } from './features/carrito/carrito.component';
import { ReporteComponent } from './features/reporte/reporte.component';

export const routes: Routes = [
  { path: '', redirectTo: 'carrito', pathMatch: 'full' },
  { path: 'carrito', component: CarritoComponent },
  { path: 'reporte', component: ReporteComponent },
];
