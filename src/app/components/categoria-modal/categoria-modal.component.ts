import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../models/question';
import { MaterialModule } from '../../utils/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.scss']
})
export class CategoriaModalComponent {
  categoryForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category }
  ) {
    this.isEditMode = !!data.category;
    this.categoryForm = this.fb.group({
      name: [data.category?.name || '', Validators.required],
      description: [data.category?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }
}
