import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Question } from '../../models/question';
import { BasicSearchParams, DynamicSearchParams } from '../../models/search-params';
import { QuestionService } from '../../services/question.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { MaterialModule } from '../../utils/material.module';
import { FiltrosBuscaComponent } from '../../components/filtros-busca/filtros-busca.component';
import { BuscaDinamicaComponent } from '../../components/busca-dinamica/busca-dinamica.component';
import { ItemBuscaComponent } from '../../components/item-busca/item-busca.component';

@Component({
  selector: 'app-busca',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FiltrosBuscaComponent,
    BuscaDinamicaComponent,
    ItemBuscaComponent
  ],
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss']
})
export class BuscaComponent {
  questions$: Observable<Question[]> = of([]);
  isLoading = false;
  searchPerformed = false;

  constructor(
    private questionService: QuestionService,
    private snackbarService: SnackbarService
  ) {}

  onSearch(params: BasicSearchParams): void {
    this.isLoading = true;
    this.searchPerformed = true;

    this.questionService.searchQuestions(params).subscribe({
      next: (data) => {
        this.questions$ = of(data);
        this.isLoading = false;
      },
      error: () => {
        this.snackbarService.showError('Erro ao buscar questões.');
        this.isLoading = false;
      }
    });
  }

  onDynamicSearch(params: DynamicSearchParams): void {
    this.isLoading = true;
    this.searchPerformed = true;

    this.questionService.dynamicSearch(params).subscribe({
      next: (data) => {
        this.questions$ = of(data);
        this.isLoading = false;
      },
      error: () => {
        this.snackbarService.showError('Erro na busca dinâmica.');
        this.isLoading = false;
      }
    });
  }
}
