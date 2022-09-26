import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FriendshipService } from 'src/app/services/friendship.service';
import { LiveService } from 'src/app/services/live.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})

export class UserNotificationsComponent implements OnInit {

  constructor(
    private friendship: FriendshipService,
    private live: LiveService,
    public store: StoreService
  ) { }

  @Output() onClose = new EventEmitter;
  userNotificationsOptions = {
    posts: false,
    stories: false,
    videos: false,
    reels: false,
    live: 'default'
  };

  notificationsPosts(): void {
    this.store.state.userPage.is_favorite = this.userNotificationsOptions.posts;
    if (this.userNotificationsOptions.posts) {
      this.friendship.favorite(this.store.state.userPage.pk, 'posts');
    } else {
      this.friendship.unfavorite(this.store.state.userPage.pk, 'posts');
    }
  }

  notificationsStories(): void {
    this.store.state.userPage.is_favorite_for_stories = this.userNotificationsOptions.stories;
    if (this.userNotificationsOptions.stories) {
      this.friendship.favorite(this.store.state.userPage.pk, 'stories');
    } else {
      this.friendship.unfavorite(this.store.state.userPage.pk, 'stories');
    }
  }

  notificationsVideos(): void {
    this.store.state.userPage.is_favorite_for_igtv = this.userNotificationsOptions.videos;
    if (this.userNotificationsOptions.videos) {
      this.friendship.favorite(this.store.state.userPage.pk, 'videos');
    } else {
      this.friendship.unfavorite(this.store.state.userPage.pk, 'videos');
    }
  }

  notificationsReels(): void {
    this.store.state.userPage.is_favorite_for_clips = this.userNotificationsOptions.reels;
    if (this.userNotificationsOptions.reels) {
      this.friendship.favorite(this.store.state.userPage.pk, 'reels');
    } else {
      this.friendship.unfavorite(this.store.state.userPage.pk, 'reels');
    }
  }

  notificationsLive(): void {
    if (this.store.state.userPage.live_subscription_status != this.userNotificationsOptions.live) {
      this.store.state.userPage.live_subscription_status = this.userNotificationsOptions.live;
      this.live.setSubscriptionPreference(this.store.state.userPage.pk, this.userNotificationsOptions.live);
    }
  }

  ngOnInit(): void {
    this.userNotificationsOptions = {
      posts: this.store.state.userPage.is_favorite,
      stories: this.store.state.userPage.is_favorite_for_stories,
      videos: this.store.state.userPage.is_favorite_for_igtv,
      reels: this.store.state.userPage.is_favorite_for_clips,
      live: this.store.state.userPage.live_subscription_status
    };
  }
}
