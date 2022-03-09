import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
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
  feedStories: any[] = [];

  private feedError() {
    return throwError(() => new Error('Feed error: cannot load feed information.'));
  }

  async loadFeed(): Promise<void> {
    await lastValueFrom(this.http.post<object[]>('/api/feed', { feed: localStorage.getItem("feed"), session: localStorage.getItem("state") })
      .pipe(catchError(this.feedError))).then((data: any) => {
        console.info('Feed loaded successfully!');
        localStorage.setItem('feed', data.feed);
        this.feedPosts = this.feedPosts.concat(data.posts);
      });
  }

  private storiesError() {
    return throwError(() => new Error('Stories error: cannot load stories tray information.'));
  }

  async loadStories(): Promise<void> {
    await lastValueFrom(this.http.post<object[]>('/api/stories_tray', { session: localStorage.getItem("state") })
      .pipe(catchError(this.storiesError))).then((data: any) => {
        console.info('Stories tray loaded successfully!');
        this.feedStories = this.feedStories.concat(data);
      });
  }

  async ngOnInit(): Promise<void> {
    // Reset temporal feed cached object.
    localStorage.removeItem('feed');
    // Force sync loading to avoid server spamming.
    await this.loadFeed();
    await this.loadStories();
  }
}
