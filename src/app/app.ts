import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './core/services/auth.service';
import { CarritoStateService } from './core/services/carrito-state.service';
import { CarritoService } from './core/services/carrito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatTooltipModule, MatSidenavModule, MatListModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  fechaPromocional = false;
  menuAbierto = false;

  constructor(
    protected auth: AuthService,
    protected state: CarritoStateService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.getFechaPromocional().subscribe({
      next: res => this.fechaPromocional = res.fechaPromocional
    });
  }

  navegar(ruta: string) {
    this.menuAbierto = false;
    this.router.navigate([ruta]);
  }

  logout() {
    this.menuAbierto = false;
    this.auth.logout().subscribe({
      complete: () => { this.state.setCarrito(null); this.router.navigate(['/login']); },
      error: () => { this.state.setCarrito(null); this.router.navigate(['/login']); }
    });
  }
}
