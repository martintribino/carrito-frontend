import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CarritoStateService } from '../../core/services/carrito-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  dni = '';
  password = '';
  error = '';
  loading = false;
  fechaPromocional = false;

  constructor(
    private auth: AuthService,
    private carritoService: CarritoService,
    private state: CarritoStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.getFechaPromocional().subscribe({
      next: res => {
        this.fechaPromocional = res.fechaPromocional;
        this.state.setFechaPromocional(res.fechaPromocional);
      }
    });
  }

  toggleFecha() {
    this.carritoService.setFechaPromocional(this.fechaPromocional).subscribe({
      next: () => this.state.setFechaPromocional(this.fechaPromocional)
    });
  }

  login() {
    if (!this.dni.trim() || !this.password) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.dni.trim(), this.password).subscribe({
      next: (res) => {
        this.carritoService.carritoActivo(res.dni).subscribe({
          next: c => {
            this.state.setCarrito(c);
            this.router.navigate(['/store']);
          }
        });
      },
      error: e => { this.error = e.error?.error || 'Credenciales inválidas'; this.loading = false; }
    });
  }
}
