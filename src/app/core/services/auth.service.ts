import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  dni: string;
  nombre: string;
  esVip: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<LoginResponse | null>(this.loadValidUser());

  user = this._user.asReadonly();
  isLoggedIn = computed(() => !!this._user() && !this.isTokenExpired());

  constructor(private http: HttpClient) {}

  login(dni: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { dni, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
        this._user.set(res);
      })
    );
  }

  logout() {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, null).pipe(
      tap({
        next: () => this.clearLocal(),
        error: () => this.clearLocal()
      })
    );
  }

  forceLogout() {
    this.clearLocal();
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.clearLocal();
      return null;
    }
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private clearLocal() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
  }

  private loadValidUser(): LoginResponse | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    if (this.isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return JSON.parse(raw);
  }
}
