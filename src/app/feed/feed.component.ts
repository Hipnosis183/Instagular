import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  feedPosts: any[] = [];
  feedPost: any = null;

  openMedia(post: any): void {
    this.feedPost = post;
  }

  closeMedia(): void {
    this.feedPost = null;
  }

  loadFeed(): void {
    this.http.post<object[]>('/api/feed', { session: localStorage.getItem("state") })
      .subscribe((data) => {
        console.info('Feed loaded successfully!');
        console.log(data);
        this.feedPosts = data;
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
        let i = this.feedPosts.findIndex((res) => res.id == id);
        this.feedPosts[i].has_liked = true;
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
        let i = this.feedPosts.findIndex((res) => res.id == id);
        this.feedPosts[i].has_liked = false;
      });
  }

  ngOnInit(): void {
    this.loadFeed();
  }
}
