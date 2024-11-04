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
  toastType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const url = 'https://devbank-api-cac1c6aee9bf.herokuapp.com/login/validar';
    const params = { email: this.email, senha: this.password };

    this.http.get(url, { params }).subscribe({
      next: (response: any) => {
        console.log('Login bem-sucedido:', response);
        this.showToast('Login bem-sucedido!', 'success');

        // Armazenar indicador de autenticação no localStorage
        localStorage.setItem('authToken', 'true');
        
        // Redirecionando para a página inicial com parâmetros
        this.router.navigate(['/inicio'], { queryParams: { pessoaLoginResponseDTO: JSON.stringify(response) } });
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Erro desconhecido';

        if (error.error instanceof ErrorEvent) {
          // Erro no lado do cliente ou erro de rede
          errorMessage = error.error.message;
        } else {
          // Erro no lado do servidor
          errorMessage = error.error ? error.error : 'Erro ao processar a solicitação';
        }
        
        console.error('Erro ao fazer login:', error);
        this.showToast(errorMessage, 'error');
      }
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;

    // Ocultar o toast após um tempo definido (3 segundos)
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }
}
