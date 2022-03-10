import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  userProfile: any = null;

  private profileError() {
    return throwError(() => new Error('Profile error: cannot load user profile information.'));
  }

  loadProfile(): void {
    this.http.post<string>('/api/profile', { session: localStorage.getItem("state") })
      .pipe(catchError(this.profileError))
      .subscribe((data) => {
        console.info('Profile loaded successfully!');
        this.userProfile = data;
      });
  }

  private logoutError() {
    return throwError(() => new Error('Logout error: no session active.'));
  }

  logoutUser(): void {
    this.http.post('/api/logout', { session: localStorage.getItem("state") })
      .pipe(catchError(this.logoutError))
      .subscribe(() => {
        console.info('Logged out successfully!');
        localStorage.removeItem('state');
        window.location.reload();
      });
  }

  ngOnInit(): void {
    this.loadProfile();
  }
}
