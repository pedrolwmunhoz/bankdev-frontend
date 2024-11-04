import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CadastrarComponent } from './cadastro/cadastrar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal (tela de login)
  { path: 'cadastrar', component: CadastrarComponent }, // Página de cadastro
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] } // Página inicial do banco após login bem-sucedido, protegida pelo AuthGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
