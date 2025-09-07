import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../utils/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface NavButton {
  label: string;
  route?: string | null;
  requiresAuth: boolean;
  isLogin: boolean;
  isLogout?: boolean | null;
}

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private _isUserLoggedIn: boolean = false;

  @Input()
  set isUserLoggedIn(value: boolean | null) {
    this._isUserLoggedIn = !!value;
    this.updateVisibleButtons();
  }

  allNavButtons: NavButton[] = [
    { label: 'Home', route: '/', requiresAuth: false, isLogin: false },
    { label: 'Busca', route: '/pesquisa', requiresAuth: true, isLogin: false },
    { label: 'Login', route: '/login', requiresAuth: false, isLogin: true },
    { label: 'Cadastrar Questão', route: '/cadastroquestao', requiresAuth: true, isLogin: false },
    { label: 'Perfil', requiresAuth: true, isLogin: false, isLogout: true }
  ];
  
  visibleNavButtons: NavButton[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.updateVisibleButtons();
  }

  updateVisibleButtons(): void {
    this.visibleNavButtons = this.allNavButtons.filter(button => {
      if (this._isUserLoggedIn) {
        return !button.isLogin;
      } else {
        return !button.requiresAuth;
      }
    });
  }

  navigateTo(route?: string | null): void {
    if (!route || route == '' || route == null || route == undefined) return;

    this.router.navigate([route]);
  }

  logout(){
    this.authService.logout();
  }
  
}
