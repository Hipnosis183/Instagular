import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})

export class PageLoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  private loginError() {
    return throwError(() => new Error('Login error: incorrect username or password.'));
  }

  loginUser(): void {
    this.http.post<string>('/api/account/login', this.loginForm.value)
      .pipe(catchError(this.loginError))
      .subscribe((data) => {
        console.info('Logged in successfully!');
        localStorage.setItem('state', JSON.stringify(data));
        localStorage.setItem('user', this.loginForm.value.username);
        window.location.reload();
      });
  }

  ngOnInit(): void {
  }
}
