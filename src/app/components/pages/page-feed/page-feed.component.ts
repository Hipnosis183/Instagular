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

  async loadFeed(reload?: boolean): Promise<void> {
    if (reload) { localStorage.removeItem('feed'); }
    await lastValueFrom(this.http.post<object[]>('/api/feed/timeline', { feed: localStorage.getItem("feed"), session: localStorage.getItem("state") })
      .pipe(catchError(this.feedError))).then((data: any) => {
        console.info('Feed loaded successfully!');
        localStorage.setItem('feed', data.feed);
        if (reload) { this.feedPosts = []; }
        this.feedPosts = this.feedPosts.concat(data.posts);
      });
  }

  private storiesError() {
    return throwError(() => new Error('Stories error: cannot load stories tray information.'));
  }

  async loadStories(reload?: boolean): Promise<void> {
    await lastValueFrom(this.http.post<object[]>('/api/feed/reels_tray', { session: localStorage.getItem("state") })
      .pipe(catchError(this.storiesError))).then((data: any) => {
        console.info('Stories tray loaded successfully!');
        if (reload) { this.feedStories = []; }
        this.feedStories = this.feedStories.concat(data);
      });
  }

  async reloadFeed(feed: string): Promise<void> {
    // Force sync loading to avoid server spamming.
    switch (feed) {
      case 'timeline': { await this.loadFeed(true); break; }
      case 'stories': { await this.loadStories(true); break; }
      case 'all': { await this.loadFeed(true); await this.loadStories(true); break; }
    }
  }

  async ngOnInit(): Promise<void> {
    await this.reloadFeed('all');
  }
}
