import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedService } from 'src/app/services/feed.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'user-feeds',
  templateUrl: './user-feeds.component.html',
  styleUrls: ['./user-feeds.component.css']
})

export class UserFeedsComponent {

  constructor(
    private feed: FeedService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public store: StoreService,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  feedSelect: string = 'timeline';
  feedSelected: any = {
    timeline: false,
    reels: false,
    video: false,
    tagged: false
  };

  feedLoaded: any = {
    timeline: false,
    reels: false,
    video: false,
    tagged: false,
    saved: false,
  };

  async feedTimeline(): Promise<void> {
    this.feedSelect = 'timeline';
    this.location.go(this.store.state.userPage.username);
    if (!this.feedSelected.timeline) {
      this.feedSelected.timeline = true;
      await this.loadUser();
      this.feedLoaded.timeline = true;
    }
  }

  async feedReels(): Promise<void> {
    if (this.store.state.userPage.total_clips_count) {
      this.feedSelect = 'reels';
      this.location.go(this.store.state.userPage.username + '/reels');
      if (!this.feedSelected.reels) {
        this.feedSelected.reels = true;
        await this.loadReels();
        this.feedLoaded.reels = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedVideo(): Promise<void> {
    if (this.store.state.userPage.has_videos) {
      this.feedSelect = 'video';
      this.location.go(this.store.state.userPage.username + '/channel');
      if (!this.feedSelected.video) {
        this.feedSelected.video = true;
        await this.loadVideo();
        this.feedLoaded.video = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedTagged(): Promise<void> {
    if (this.store.state.userPage.usertags_count) {
      this.feedSelect = 'tagged';
      this.location.go(this.store.state.userPage.username + '/tagged');
      if (!this.feedSelected.tagged) {
        this.feedSelected.tagged = true;
        await this.loadTagged();
        this.feedLoaded.tagged = true;
      }
    } else { this.feedTimeline(); }
  }

  feedSavedUrl: string = '';

  async feedSaved(): Promise<void> {
    if (this.store.state.userPage.has_saved_items) {
      this.feedSelect = 'saved';
      this.location.go(this.store.state.userPage.username + '/saved' + this.feedSavedUrl);
    } else { this.feedTimeline(); }
  }

  userPosts: any[] = [];
  userReels: any[] = [];
  userTagged: any[] = [];
  userVideos: any[] = [];

  async loadUser(): Promise<void> {
    await this.feed.user(this.route.snapshot.paramMap.get('id')).then((data) => {
      this.userPosts = this.userPosts.concat(data.posts);
    });
  }

  async loadReels(): Promise<void> {
    await this.feed.reels(this.store.state.userPage.pk).then((data) => {
      this.userReels = this.userReels.concat(data.posts);
    });
  }

  async loadVideo(): Promise<void> {
    await this.feed.video(this.store.state.userPage.pk, this.route.snapshot.paramMap.get('id')).then((data) => {
      this.userVideos = this.userVideos.concat(data.posts);
    });
  }

  async loadTagged(): Promise<void> {
    await this.feed.tagged(this.store.state.userPage.pk).then((data) => {
      this.userTagged = this.userTagged.concat(data.posts);
    });
  }

  loadSaved(): void {
    if (this.store.state.userPage.has_saved_items && this.store.state.savedPosts.length > 0) {
      this.feedLoaded.saved = true;
    }
  }

  loadTabs(): void {
    if (!this.store.state.userPage.is_private || (this.store.state.userPage.is_private && this.store.state.userPage.friendship.following)) {
      let tab = this.route.snapshot.paramMap.get('tab');
      switch (tab) {
        case 'reels': { this.feedReels(); break; }
        case 'channel': { this.feedVideo(); break; }
        case 'tagged': { this.feedTagged(); break; }
        case 'saved': { this.feedSaved(); break; }
        default: { this.feedTimeline(); break; }
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.loadSaved();
    this.loadTabs();
  }
}
