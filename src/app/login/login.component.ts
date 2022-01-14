import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  private loginError(error: HttpErrorResponse) {
    return throwError('Login error: incorrect username or password.');
  }

  loginUser(): void {
    this.http.post<string>('/api/login', this.loginForm.value)
      .pipe(catchError(this.loginError))
      .subscribe((data) => {
        console.info('Logged in successfully!');
        localStorage.setItem('state', JSON.stringify(data));
      });
  }

  private logoutError(error: HttpErrorResponse) {
    return throwError('Logout error: no session active.');
  }

  logoutUser(): void {
    this.http.post('/api/logout', { session: localStorage.getItem("state") })
      .pipe(catchError(this.logoutError))
      .subscribe(() => {
        console.info('Logged out successfully!');
        localStorage.removeItem('state');
      });
  }

  private sessionError(error: HttpErrorResponse) {
    return throwError('Session error: corrupted stored data or the session has expired.');
  }

  loadSession(): void {
    this.http.post<string>('/api/session', { session: localStorage.getItem("state") })
      .pipe(catchError(this.sessionError))
      .subscribe((data) => {
        console.info('Session loaded!');
        localStorage.setItem('state', JSON.stringify(data));
      });
  }

  ngOnInit(): void {
    if (localStorage.getItem("state") != null) {
      console.info('Session found!');
      this.loadSession();
    } else {
      console.info('Session not found.');
    }
  }
}
