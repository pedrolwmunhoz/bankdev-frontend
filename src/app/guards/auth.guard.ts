import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Verifica se existe um token de autenticação

    if (isAuthenticated) {
      return true; // Se autenticado, permite o acesso
    } else {
      this.router.navigate(['/']); // Redireciona para login se não autenticado
      return false;
    }
  }
}
