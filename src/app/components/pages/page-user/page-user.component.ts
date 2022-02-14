import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})

export class PageUserComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private title: Title
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  userNotFound: boolean = false;
  userPosts: any[] = [];
  userProfile: any = null

  private profileError() {
    this.title.setTitle('Page not found · Instagular');
    this.userNotFound = true; return of();
    return throwError(() => new Error('Profile error: cannot load user profile information.'));
  }

  loadProfile(): void {
    this.http.post<any>('/api/profile', { id: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem("state") })
      .pipe(catchError(this.profileError.bind(this)))
      .subscribe((data: any) => {
        console.info('Profile loaded successfully!');
        console.log(data);
        this.userProfile = data;
        this.title.setTitle(`${data.full_name} (@${data.username})`);
        if (!data.is_private) { this.loadUser(); }
      });
  }

  private userError() {
    return throwError(() => new Error('User error: cannot load user media.'));
  }

  loadUser(): void {
    this.http.post<object[]>('/api/user', { id: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem("state") })
      .pipe(catchError(this.userError))
      .subscribe((data) => {
        console.info('User loaded successfully!');
        console.log(data);
        this.userPosts = data;
      });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.title.setTitle('Instagular');
  }
}
