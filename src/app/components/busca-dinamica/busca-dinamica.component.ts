import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../utils/material.module';
import { DynamicSearchParams } from '../../models/search-params';
import { Category } from '../../models/question';
import { CategoryService } from '../../services/categoria.service';

@Component({
  selector: 'app-busca-dinamica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './busca-dinamica.component.html',
  styleUrls: ['./busca-dinamica.component.scss']
})
export class BuscaDinamicaComponent implements OnInit {
  @Output() dynamicSearch = new EventEmitter<DynamicSearchParams>();
  dynamicSearchForm: FormGroup;
  allCategories: Category[] = [];

  questionTypes = [
    { id: 1, name: 'Discursiva' },
    { id: 2, name: 'Objetiva' }
  ];

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.dynamicSearchForm = this.fb.group({
      quantity: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      categories: [[], Validators.required],
      types: [[1, 2], Validators.required],
      minDifficulty: [1, Validators.required],
      maxDifficulty: [5, Validators.required],
      minReputation: [0, Validators.required],
      maxReputation: [5, Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }
  
  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => this.allCategories = cats);
  }

  formatLabel(value: number): string {
    return `${value}`;
  }
  
  formatReputationLabel(value: number): string {
    return `${value}★`;
  }

  onSubmit() {
    if (this.dynamicSearchForm.valid) {
      this.dynamicSearch.emit(this.dynamicSearchForm.value);
    }
  }
}
