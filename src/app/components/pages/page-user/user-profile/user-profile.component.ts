import { Component, Input } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { FriendshipService } from 'src/app/services/friendship.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {

  constructor(
    private feed: FeedService,
    private friendship: FriendshipService,
  ) { }

  @Input() userProfile: any;
  userName: any = localStorage.getItem('username');

  followUser(): void {
    this.userProfile.friendship.following = true;
    this.friendship.follow(this.userProfile.pk);
  }

  unfollowUser(): void {
    this.userProfile.friendship.following = false;
    this.friendship.unfollow(this.userProfile.pk);
  }

  userFollowers: any[] = [];
  loadFollowers: boolean = false;
  loadedFollowers: boolean = false;

  _loadFollowers(): void {
    this.loadFollowers = true;
    if (!this.loadedFollowers) {
      this.__loadFollowers();
      this.loadedFollowers = true;
    }
  }

  __loadFollowers(): void {
    this.feed.followers(this.userProfile.pk).then((data) => {
      this.userFollowers = this.userFollowers.concat(data.followers);
    });
  }

  userFollowing: any[] = [];
  loadFollowing: boolean = false;
  loadedFollowing: boolean = false;

  _loadFollowing(): void {
    this.loadFollowing = true;
    if (!this.loadedFollowing) {
      this.__loadFollowing();
      this.loadedFollowing = true;
    }
  }

  __loadFollowing(): void {
    this.feed.following(this.userProfile.pk).then((data) => {
      this.userFollowing = this.userFollowing.concat(data.following);
    });
  }

  loadStories: boolean = false;

  openStories(): void {
    if (this.userProfile.reels) {
      this.loadStories = true;
    }
  }
}
