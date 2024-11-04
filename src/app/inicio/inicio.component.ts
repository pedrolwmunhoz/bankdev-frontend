import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  pessoaFisica: any = null;
  pessoaJuridica: any = null;
  clienteNome: string = '';
  numeroConta: string = ''; // Número da conta, formatado corretamente
  saldoAtual: number = 0;
  limiteCredito: number = 0;
  idPessoa: number | null = null;
  idPessoaTransferir: number | null = null;
  valorTransferencia: number | null = null;
  extrato: any[] = [];

  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' | '' = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const response = params['pessoaLoginResponseDTO'] ? JSON.parse(params['pessoaLoginResponseDTO']) : null;

      if (response) {
        this.idPessoa = response.idPessoa;
        this.saldoAtual = response.saldoDTO?.saldoAtual || 0;
        this.limiteCredito = response.saldoDTO?.limiteCredito || 0;

        this.pessoaFisica = response.pessoaFisicaDTO || null;
        this.pessoaJuridica = response.pessoaJuridicaDTO || null;

        this.clienteNome = this.pessoaFisica?.nome || this.pessoaJuridica?.razaoSocial || '';

        this.numeroConta = `4004${this.idPessoa}`;
        if (this.idPessoa) {
          this.atualizarDadosTransferencia(this.idPessoa);
        }
      }
    });
  }

  obterExtrato(idPessoa: number): void {
    const url = `https://devbank-api-cac1c6aee9bf.herokuapp.com/extrato/detalhado?idPessoa=${idPessoa}`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.extrato = response;
        } else {
          this.extrato = []; // Certifique-se de redefinir o extrato se não houver registros
          this.showToast('Nenhum movimento encontrado no extrato.', 'info');
        }
      },
      error: (error) => {
        this.showToast('Erro ao obter extrato.', 'error');
      }
    });
  }

  transferir(): void {
    if (this.idPessoa && this.idPessoaTransferir && this.valorTransferencia) {
      const url = `https://devbank-api-cac1c6aee9bf.herokuapp.com/transferencias?idOrigem=${this.idPessoa}&idDestino=${this.idPessoaTransferir}&valor=${this.valorTransferencia}`;
      
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (response: string) => {
          this.showToast(response || 'Transferência realizada com sucesso!', 'success');
          
          // Atualiza os valores do saldo e extrato a partir do parâmetro de resposta
          if (this.idPessoa) {
            this.atualizarDadosTransferencia(this.idPessoa);
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error instanceof ErrorEvent ? error.error.message : error.error || 'Erro ao realizar transferência';
          this.showToast(errorMessage, 'error');
        }
      });
    } else {
      this.showToast('Por favor, preencha todos os campos de transferência corretamente.', 'error');
    }
  }

  atualizarDadosTransferencia(idPessoa: number): void {
    // Atualiza os valores do saldo e extrato após transferência
    this.atualizarSaldo(idPessoa);
    this.obterExtrato(idPessoa);
  }

  atualizarSaldo(idPessoa: number): void {
    const urlSaldo = `https://devbank-api-cac1c6aee9bf.herokuapp.com/extrato/saldo?idPessoa=${idPessoa}`;
    this.http.get(urlSaldo).subscribe({
      next: (response: any) => {
        this.saldoAtual = response.saldoAtual;
        this.limiteCredito = response.limiteCredito;
      },
      error: (error: HttpErrorResponse) => {
        this.showToast('Erro ao atualizar saldo e limite após transferência.', 'error');
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toastMessage = message;
    this.toastType = type;

    // Ocultar o toast após um tempo definido (3 segundos)
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }
}
