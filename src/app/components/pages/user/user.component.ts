import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private title: Title
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  userPosts: any[] = [];
  userPost: any = null;
  userProfile: any = null

  openMedia(post: any): void {
    this.userPost = post;
  }

  closeMedia(): void {
    this.userPost = null;
  }

  private profileError(error: HttpErrorResponse) {
    return throwError('Profile error: cannot load user profile information.');
  }

  loadProfile(): void {
    this.http.post<any>('/api/profile', { id: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem("state") })
      .pipe(catchError(this.profileError))
      .subscribe((data) => {
        console.info('Profile loaded successfully!');
        console.log(data);
        this.userProfile = data;
        this.title.setTitle(`${data.full_name} (@${data.username})`);
      });
  }

  private userError(error: HttpErrorResponse) {
    return throwError('User error: cannot load user media.');
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

  private likeError(error: HttpErrorResponse) {
    return throwError('Media error: could not like the media.');
  }

  likeMedia(id: string): void {
    this.http.post('/api/like', { session: localStorage.getItem("state"), mediaId: id })
      .pipe(catchError(this.likeError))
      .subscribe((data) => {
        console.info('Media liked successfully!');
        let i = this.userPosts.findIndex((res) => res.id == id);
        this.userPosts[i].has_liked = true;
      });
  }

  private unlikeError(error: HttpErrorResponse) {
    return throwError('Media error: could not unlike the media.');
  }

  unlikeMedia(id: string): void {
    this.http.post('/api/unlike', { session: localStorage.getItem("state"), mediaId: id })
      .pipe(catchError(this.unlikeError))
      .subscribe((data) => {
        console.info('Media unliked successfully!');
        let i = this.userPosts.findIndex((res) => res.id == id);
        this.userPosts[i].has_liked = false;
      });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.title.setTitle('Instagular');
  }
}
