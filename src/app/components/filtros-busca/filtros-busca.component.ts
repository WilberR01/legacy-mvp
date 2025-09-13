import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../utils/material.module';
import { BasicSearchParams } from '../../models/search-params';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filtros-busca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './filtros-busca.component.html',
  styleUrls: ['./filtros-busca.component.scss']
})
export class FiltrosBuscaComponent {
  @Output() search = new EventEmitter<BasicSearchParams>();
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      text: [''],
      categoryId: [null],
      reputation: [0]
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(values => {
      this.search.emit(values);
    });
  }

  formatLabel(value: number): string {
    return `${value}★`;
  }

  clearFilters() {
    this.searchForm.reset({
      text: '',
      categoryId: null,
      reputation: 0
    });
    this.search.emit(this.searchForm.value);
  }
}
