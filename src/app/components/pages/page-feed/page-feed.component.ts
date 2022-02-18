import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'page-feed',
  templateUrl: './page-feed.component.html',
  styleUrls: ['./page-feed.component.css']
})

export class PageFeedComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  feedPosts: any[] = [];

  private feedError() {
    return throwError(() => new Error('Feed error: cannot load feed information.'));
  }

  loadFeed(): void {
    this.http.post<object[]>('/api/feed', { feed: localStorage.getItem("feed"), session: localStorage.getItem("state") })
      .pipe(catchError(this.feedError))
      .subscribe((data: any) => {
        console.info('Feed loaded successfully!');
        console.log(data);
        localStorage.setItem('feed', data.feed);
        this.feedPosts = this.feedPosts.concat(data.posts);
      });
  }

  ngOnInit(): void {
    localStorage.removeItem('feed');
    this.loadFeed();
  }
}
