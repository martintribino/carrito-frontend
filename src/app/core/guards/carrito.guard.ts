import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CarritoStateService } from '../services/carrito-state.service';

export const carritoGuard: CanActivateFn = () => {
  if (inject(CarritoStateService).tieneItems()) return true;
  inject(Router).navigate(['/store']);
  return false;
};
