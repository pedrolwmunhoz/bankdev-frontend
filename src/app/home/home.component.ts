import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email: string = '';
  password: string = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const url = 'https://devbank-api-cac1c6aee9bf.herokuapp.com/login/validar';
    const params = { email: this.email, senha: this.password };

    this.http.get(url, { params }).subscribe({
      next: (response: any) => {
        console.log('Login bem-sucedido:', response);
        this.toastMessage = 'Login bem-sucedido!';
        this.toastType = 'success';

        // Armazenar indicador de autenticação no localStorage
        localStorage.setItem('authToken', 'true');
        
        // Redirecionando para a página inicial com parâmetros
        this.router.navigate(['/inicio'], { queryParams: { pessoaLoginResponseDTO: JSON.stringify(response) } });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao fazer login:', error);
        this.toastMessage = 'Erro ao fazer login: ' + (error.error || 'Credenciais inválidas');
        this.toastType = 'error';
      }
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;

    // Ocultar o toast após um tempo definido (3 segundos)
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}
