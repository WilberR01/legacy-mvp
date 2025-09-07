import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginCredentials, LoginResponse } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router
  ) { }

  private hasToken(): boolean {
    const storage = localStorage.getItem('authToken');

    return storage != undefined && storage != null && storage !== 'undefined' && storage !== 'null';
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.user.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this._isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
}

