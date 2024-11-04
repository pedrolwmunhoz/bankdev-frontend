import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent {

  step: number = 1;
  email: string = '';
  password: string = '';
  tipoPessoa: string = '';
  cpf: string = '';
  nome: string = '';
  idade: number | null = null;
  cnpj: string = '';
  razaoSocial: string = '';
  nomeFantasia: string = '';
  telefone: string = '';
  cep: string = '';
  logradouro: string = '';
  numero: string = '';
  complemento: string = '';
  bairro: string = '';
  cidade: string = '';
  estado: string = '';
  saldoAtual: number = 55000;
  limiteCredito: number = 15000;

  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient) {}

  proximoPasso() {
    if (this.step < 6) {
      this.step++;
    }
  }

  voltarPasso() {
    if (this.step > 1) {
      this.step--;
    }
  }

  selecionarTipoPessoa() {
    this.step = 3;
  }

  buscarCep() {
    if (this.cep) {
      this.http.get<any>(`https://viacep.com.br/ws/${this.cep}/json/`).subscribe(
        data => {
          if (data && !data.erro) {
            this.logradouro = data.logradouro;
            this.bairro = data.bairro;
            this.cidade = data.localidade;
            this.estado = data.uf;
          }
          this.proximoPasso();
        },
        error => {
          console.error('Erro ao buscar CEP:', error);
          this.showToast('Erro ao buscar CEP. Por favor, tente novamente.', 'error');
          this.proximoPasso();
        }
      );
    } else {
      this.proximoPasso();
    }
  }

  cadastrar() {
    if (!this.isFormValid()) {
      this.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const pessoaCadastroDTO = {
      pessoa: {
        tipo: this.tipoPessoa,
        telefone: this.telefone,
        email: this.email
      },
      pessoaFisicaDTO: this.tipoPessoa === 'fisica' ? {
        nome: this.nome,
        idade: this.idade,
        cpf: this.cpf,
        telefone: this.telefone,
        email: this.email
      } : null,
      pessoaJuridicaDTO: this.tipoPessoa === 'juridica' ? {
        razaoSocial: this.razaoSocial,
        nomeFantasia: this.nomeFantasia,
        cnpj: this.cnpj,
        telefone: this.telefone,
        email: this.email
      } : null,
      login: {
        email: this.email,
        senha: this.password
      },
      endereco: {
        logradouro: this.logradouro,
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro,
        cidade: this.cidade,
        estado: this.estado,
        cep: this.cep
      },
      saldo: {
        saldoAtual: this.saldoAtual,
        limiteCredito: this.limiteCredito,
        dataUltimaAtualizacao: new Date().toISOString().split('T')[0]  // formato ISO para data
      }
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('https://devbank-api-cac1c6aee9bf.herokuapp.com/api/pessoas/cadastrar', JSON.stringify(pessoaCadastroDTO), { headers, responseType: 'text' })
      .subscribe({
        next: response => {
          console.log('Cadastro realizado com sucesso:', response);
          this.showToast(response, 'success'); // Mostra a mensagem da resposta do servidor
          this.limparFormulario();
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
          this.showToast(errorMessage, 'error');
          console.error('Erro ao cadastrar:', error);
        }
      });
  }

  isFormValid(): boolean {
    if (this.tipoPessoa === 'fisica') {
      return !!(this.email && this.password && this.cpf && this.nome && this.idade && this.telefone && this.logradouro && this.numero && this.bairro && this.cidade && this.estado && this.cep);
    } else if (this.tipoPessoa === 'juridica') {
      return !!(this.email && this.password && this.cnpj && this.razaoSocial && this.nomeFantasia && this.telefone && this.logradouro && this.numero && this.bairro && this.cidade && this.estado && this.cep);
    } else {
      return false;
    }
  }

  limparFormulario() {
    this.step = 1;
    this.email = '';
    this.password = '';
    this.tipoPessoa = '';
    this.cpf = '';
    this.nome = '';
    this.idade = null;
    this.cnpj = '';
    this.razaoSocial = '';
    this.nomeFantasia = '';
    this.telefone = '';
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.cidade = '';
    this.estado = '';
    this.saldoAtual = 5000; // Reseta para valor padrão
    this.limiteCredito = 10000; // Reseta para valor padrão
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;

    // Auto-hide the toast after 3 seconds
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }
}
