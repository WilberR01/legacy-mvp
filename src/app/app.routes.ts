import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroQuestaoComponent } from './pages/cadastro/cadastro-questao.component';
import { BuscaComponent } from './pages/busca/busca.component';
import { F } from '@angular/cdk/keycodes';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full'},
    { path: 'cadastroquestao', component: CadastroQuestaoComponent, pathMatch: 'full'},
    { path: 'pesquisa', component: BuscaComponent, pathMatch: 'full'}
];
