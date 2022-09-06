import { Component } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'page-feed',
  templateUrl: './page-feed.component.html',
  styleUrls: ['./page-feed.component.css']
})

export class PageFeedComponent {

  constructor(private feed: FeedService) { }

  feedPosts: any[] = [];
  feedStories: any[] = [];

  async loadFeed(reload?: boolean): Promise<void> {
    if (reload) { localStorage.removeItem('feed'); }
    await this.feed.timeline().then((data) => {
      if (reload) { this.feedPosts = []; }
      this.feedPosts = this.feedPosts.concat(data.posts);
    });
  }

  async loadStories(reload?: boolean): Promise<void> {
    await this.feed.reelsTray().then((data) => {
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

  async updateFeed(id: number): Promise<void> {
    this.feedPosts = this.feedPosts.filter((v) => v.user.pk != id);
    await this.reloadFeed('stories');
  }

  async ngOnInit(): Promise<void> {
    await this.reloadFeed('all');
  }
}
