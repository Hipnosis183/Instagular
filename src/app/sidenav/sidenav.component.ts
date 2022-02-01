import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    private router: Router
  ) { }

  userProfile: any = null

  private profileError(error: HttpErrorResponse) {
    return throwError('Profile error: cannot load user profile information.');
  }

  loadProfile(): void {
    this.http.post<string>('/api/profile', { session: localStorage.getItem("state") })
      .pipe(catchError(this.profileError))
      .subscribe((data) => {
        console.info('Profile loaded successfully!');
        console.log(data);
        this.userProfile = data;
      });
  }

  ngOnInit(): void {
    this.loadProfile();
  }
}
