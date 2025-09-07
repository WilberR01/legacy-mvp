import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../utils/snackbar.service';
import { passwordMatchValidator } from './password-match.validator';
import { LoginCredentials, User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../utils/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegisterMode = false;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const credentials: LoginCredentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Login bem-sucedido!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message || 'Erro desconhecido no login.');
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const { confirmPassword, ...userData } = this.registerForm.value;
    this.authService.register(userData as User).subscribe({
      next: () => {
        this.snackbarService.showSuccess('Registro realizado com sucesso! Faça o login.');
        this.isRegisterMode = false;
      },
      error: (err) => {
        this.snackbarService.showError(err.error.message || 'Erro desconhecido no registro.');
      }
    });
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.isLoading = true;

    //Simula chamada ONLINE com tempo de espera
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}

