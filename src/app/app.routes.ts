import { Routes } from '@angular/router';
import { CarritoComponent } from './features/carrito/carrito.component';
import { ReporteComponent } from './features/reporte/reporte.component';
import { StoreComponent } from './features/store/store.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { carritoGuard } from './core/guards/carrito.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'store', component: StoreComponent },
  { path: 'carrito', component: CarritoComponent, canActivate: [authGuard, carritoGuard] },
  { path: 'reporte', component: ReporteComponent, canActivate: [authGuard] },
];
