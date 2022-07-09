import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class AccountService {

  constructor(private http: HttpClient) { }

  login(form: { username: string, password: string }): void {
    this.http.post('/api/account/login', form)
      .subscribe((data) => {
        localStorage.setItem('state', JSON.stringify(data));
        window.location.reload();
      });
  }

  logout(): void {
    this.http.post('/api/account/logout', {
      session: localStorage.getItem('state'),
    }).subscribe(() => {
      localStorage.removeItem('state');
      localStorage.removeItem('userpk');
      localStorage.removeItem('username');
      window.location.assign('');
    });
  }
}
