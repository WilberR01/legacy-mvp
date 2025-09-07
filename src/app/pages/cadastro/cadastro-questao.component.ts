import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SnackbarService } from '../../utils/snackbar.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../utils/material.module';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question';
import { BuscaCategoriaComponent } from '../../components/busca-categoria/busca-categoria.component';

@Component({
  selector: 'app-cadastro-questao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    BuscaCategoriaComponent
  ],
  templateUrl: './cadastro-questao.component.html',
  styleUrls: ['./cadastro-questao.component.scss']
})
export class CadastroQuestaoComponent implements OnInit {

  questionForm: FormGroup;
  wasQuestionSaved = false;
  savedQuestionId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      shortDescription: ['', [Validators.required, Validators.maxLength(255)]],
      fullStatement: ['', Validators.required],
      type: ['2', Validators.required],
      categoryId: [null, Validators.required],
      difficulty: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      expectedAnswer: [''],
      alternatives: this.fb.array([]),
      correctAlternativeIndex: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.onTypeChange();
    this.addAlternative();
    this.addAlternative();
  }

  get alternatives(): FormArray {
    return this.questionForm.get('alternatives') as FormArray;
  }

    onTypeChange(): void {
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      const expectedAnswerControl = this.questionForm.get('expectedAnswer');
      const alternativesControl = this.alternatives;
      const correctAlternativeIndexControl = this.questionForm.get('correctAlternativeIndex');

      if (type === '1') { // 1 = Discursiva
        expectedAnswerControl?.setValidators([Validators.required]);
        alternativesControl.clearValidators();
        alternativesControl.controls.forEach(control => {
            control.get('text')?.clearValidators();
            control.get('text')?.updateValueAndValidity();
        });
        correctAlternativeIndexControl?.clearValidators();
        correctAlternativeIndexControl?.setValue(null);
      } else { // 2 = Objetiva
        expectedAnswerControl?.clearValidators();
        if (alternativesControl.length === 0) {
          this.addAlternative();
          this.addAlternative();
        }
        alternativesControl.controls.forEach(control => {
            control.get('text')?.setValidators([Validators.required]);
            control.get('text')?.updateValueAndValidity();
        });
        correctAlternativeIndexControl?.setValidators([Validators.required]);
      }
      expectedAnswerControl?.updateValueAndValidity();
      correctAlternativeIndexControl?.updateValueAndValidity();
    });
  }

  addAlternative(): void {
    const alternativeGroup = this.fb.group({
      text: ['', Validators.required]
    });
    this.alternatives.push(alternativeGroup);
  }

  removeAlternative(index: number): void {
    this.alternatives.removeAt(index);
    const correctIndex = this.questionForm.get('correctAlternativeIndex')?.value;
    if (correctIndex === index) {
      this.questionForm.get('correctAlternativeIndex')?.setValue(null);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        this.questionForm.patchValue(json);
        this.snackbarService.showSuccess('Questão importada do JSON com sucesso!');
      } catch (error) {
        this.snackbarService.showError('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.snackbarService.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    
    const formValue = this.questionForm.getRawValue();

    const questionPayload: Question = {
      ...formValue,
      type: parseInt(formValue.type, 10),
      difficulty: parseInt(formValue.difficulty, 10)
    };

    this.questionService.createQuestion(questionPayload).subscribe({
      next: (response) => {
        this.savedQuestionId = response.questionId;
        this.wasQuestionSaved = true;
        this.snackbarService.showSuccess('Questão salva com sucesso!');
        this.resetForm();

        //Simula chamada ONLINE com tempo de espera
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message || 'Erro ao salvar a questão.');
      }
    });
  }

  resetForm(): void {
    this.questionForm.reset({
      type: '2',
      difficulty: 1,
      shortDescription: '',
      fullStatement: '',
      expectedAnswer: '',
      correctAlternativeIndex: null,
      categoryId: null
    });
    this.alternatives.clear();
    this.addAlternative();
    this.addAlternative();
  }

  navigateToSavedQuestion(): void {
    if (this.savedQuestionId) {
      this.router.navigate(['/search'], { queryParams: { id: this.savedQuestionId } });
    }
  }

  registerAnother(): void {
    this.wasQuestionSaved = false;
    this.savedQuestionId = null;
  }
}

