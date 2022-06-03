import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public router: Router,
    private store: StoreService
  ) { }

  expandedSidenav: boolean = true;

  expandSidenav(): void {
    this.expandedSidenav = !this.expandedSidenav
    localStorage.setItem('expanded', this.expandedSidenav.toString());
  }

  loadSidenav(): void {
    if (localStorage.getItem("expanded")) {
      let expanded: any = localStorage.getItem("expanded");
      this.expandedSidenav = JSON.parse(expanded);
    }
  }

  userProfile: any = null;

  private profileError() {
    return throwError(() => new Error('Profile error: cannot load user profile information.'));
  }

  loadProfile(): void {
    this.http.post<string>('/api/user/profile', { session: localStorage.getItem("state") })
      .pipe(catchError(this.profileError))
      .subscribe((data) => {
        console.info('Profile loaded successfully!');
        this.userProfile = data;
        localStorage.setItem('userpk', this.userProfile.pk);
        localStorage.setItem('username', this.userProfile.username);
        this.store.loadSaved();
      });
  }

  private logoutError() {
    return throwError(() => new Error('Logout error: no session active.'));
  }

  logoutUser(): void {
    this.http.post('/api/account/logout', { session: localStorage.getItem("state") })
      .pipe(catchError(this.logoutError))
      .subscribe(() => {
        console.info('Logged out successfully!');
        localStorage.removeItem('state');
        window.location.reload();
      });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSidenav();
  }
}
