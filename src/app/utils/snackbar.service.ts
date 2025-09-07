import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  private open(message: string, action: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, config);
  }

  showSuccess(message: string, action: string = 'Ok'): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    };
    this.open(message, action, config);
  }

  showError(message: string, action: string = 'Fechar'): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    };
    this.open(message, action, config);
  }

  showInfo(message: string, action: string = 'Entendi'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    };
    this.open(message, action, config);
  }
}
