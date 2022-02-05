import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
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
        window.location.reload()
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
        this.router.navigate(['feed']);
      });
  }

  ngOnInit(): void {
  }
}
