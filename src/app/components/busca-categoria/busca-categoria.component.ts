import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, startWith, map, of } from 'rxjs';
import { Category } from '../../models/question';
import { CategoryService } from '../../services/categoria.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { CategoriaModalComponent } from '../categoria-modal/categoria-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../utils/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-busca-categoria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatInputModule
  ],
  templateUrl: './busca-categoria.component.html',
  styleUrls: ['./busca-categoria.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BuscaCategoriaComponent),
      multi: true
    }
  ]
})
export class BuscaCategoriaComponent implements OnInit, ControlValueAccessor {
  @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger }) autocompleteTrigger?: MatAutocompleteTrigger;

  searchControl = new FormControl<string | Category>('');
  allCategories: Category[] = [];
  filteredCategories$: Observable<Category[]> = of([]);
  selectedCategory: Category | null = null;

  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor(
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  writeValue(value: number | null): void {
    if (this.allCategories.length > 0) {
      this.setInitialValue(value);
    } else {
      setTimeout(() => this.setInitialValue(value), 500);
    }
  }
  
  setInitialValue(value: number | null): void {
      if (value) {
        const category = this.allCategories.find(c => c.id === value);
        if (category) {
            this.selectedCategory = category;
            this.searchControl.setValue(category);
            this.onChange(category.id);
            this.onTouched();
        }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private _filter(value: string | Category | null): Category[] {
    if (!value) return this.allCategories;
    const filterValue = (typeof value === 'string' ? value : value.name).toLowerCase();
    return this.allCategories.filter(cat => cat.name.toLowerCase().includes(filterValue));
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        this.filteredCategories$ = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      error: () => this.snackbarService.showError('Falha ao carregar categorias.')
    });
  }

  displayCategory(category: Category): string {
    return category && category.name ? category.name : '';
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.onChange(category.id);
    this.onTouched();
  }

  unselectCategory(): void {
    this.selectedCategory = null;
    this.searchControl.setValue(null);
    this.onChange(null);
    this.onTouched();
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CategoriaModalComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.createCategory(result).subscribe({
          next: (newCategory) => {
            this.allCategories.push(newCategory);
            this.searchControl.setValue(newCategory);
            this.selectCategory(newCategory);
            this.snackbarService.showSuccess('Categoria criada com sucesso!');
          },
          error: () => this.snackbarService.showError('Falha ao criar categoria.')
        });
      }
    });
  }

  openEditModal(): void {
    if (!this.selectedCategory) return;
    const dialogRef = this.dialog.open(CategoriaModalComponent, {
      data: { category: this.selectedCategory }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedCategory) {
        this.categoryService.updateCategory(this.selectedCategory.id, result).subscribe({
          next: (updatedCategory) => {
            const index = this.allCategories.findIndex(c => c.id === updatedCategory.id);
            if(index > -1) {
              this.allCategories[index] = updatedCategory;
            }
            this.searchControl.setValue(updatedCategory);
            this.selectCategory(updatedCategory);
            this.snackbarService.showSuccess('Categoria atualizada!');
          },
          error: () => this.snackbarService.showError('Falha ao atualizar categoria.')
        });
      }
    });
  }
}

