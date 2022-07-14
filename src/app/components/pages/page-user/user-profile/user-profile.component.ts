import { Component, Input } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { FriendshipService } from 'src/app/services/friendship.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent {

  constructor(
    private feed: FeedService,
    private friendship: FriendshipService,
    public store: StoreService,
  ) { }

  @Input() userProfile: any;

  followUser(): void {
    this.userProfile.friendship.following = true;
    this.friendship.follow(this.userProfile.pk);
  }

  unfollowUser(): void {
    this.userProfile.friendship.following = false;
    this.friendship.unfollow(this.userProfile.pk);
  }

  addBestie(): void {
    this.userProfile.friendship.is_bestie = true;
    this.friendship.setBesties([this.userProfile.pk], []);
  }

  removeBestie(): void {
    this.userProfile.friendship.is_bestie = false;
    this.friendship.setBesties([], [this.userProfile.pk]);
  }

  addFavorite(): void {
    this.userProfile.friendship.is_feed_favorite = true;
    this.friendship.updateFeedFavorites([this.userProfile.pk], []);
  }

  removeFavorite(): void {
    this.userProfile.friendship.is_feed_favorite = false;
    this.friendship.updateFeedFavorites([], [this.userProfile.pk]);
  }

  removeFollower: boolean = false;

  _removeFollower(): void {
    this.userProfile.friendship.followed_by = false;
    this.friendship.removeFollower(this.userProfile.pk);
    this.removeFollower = false;
  }

  __removeFollower(): void {
    this.userProfile.follower_count--;
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
