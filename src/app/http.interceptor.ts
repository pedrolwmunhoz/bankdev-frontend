import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading/loading.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ativa o spinner de loading antes da requisição
    this.loadingService.setLoading(true);

    return next.handle(req).pipe(
      finalize(() => {
        // Desativa o spinner de loading após a resposta
        this.loadingService.setLoading(false);
      })
    );
  }
}
