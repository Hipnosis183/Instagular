import { Component } from '@angular/core';
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

  followUser(): void {
    this.store.state.userPage.friendship.following = true;
    this.friendship.follow(this.store.state.userPage.pk);
  }

  unfollowUser: boolean = false;

  _unfollowUser(): void {
    this.unfollowUser = false;
    this.store.state.userPage.friendship.following = false;
    this.store.state.userPage.friendship.is_bestie = false;
    this.store.state.userPage.friendship.is_feed_favorite = false;
    this.friendship.unfollow(this.store.state.userPage.pk);
  }

  addBestie(): void {
    this.store.state.userPage.friendship.is_bestie = true;
    this.friendship.setBesties([this.store.state.userPage.pk], []);
  }

  removeBestie(): void {
    this.store.state.userPage.friendship.is_bestie = false;
    this.friendship.setBesties([], [this.store.state.userPage.pk]);
  }

  addFavorite(): void {
    this.store.state.userPage.friendship.is_feed_favorite = true;
    this.friendship.updateFeedFavorites([this.store.state.userPage.pk], []);
  }

  removeFavorite(): void {
    this.store.state.userPage.friendship.is_feed_favorite = false;
    this.friendship.updateFeedFavorites([], [this.store.state.userPage.pk]);
  }

  removeFollower: boolean = false;

  _removeFollower(): void {
    this.store.state.userPage.friendship.followed_by = false;
    this.friendship.removeFollower(this.store.state.userPage.pk);
    this.removeFollower = false;
  }

  __removeFollower(): void {
    this.store.state.userPage.follower_count--;
  }

  blockUser: boolean = false;

  _blockUser(): void {
    this.blockUser = false;
    this.store.state.userPage.follower_count = 0;
    this.store.state.userPage.following_count = 0;
    this.store.state.userPage.friendship.blocking = true;
    this.store.state.userPage.friendship.following = false;
    this.store.state.userPage.friendship.is_bestie = false;
    this.store.state.userPage.friendship.is_feed_favorite = false;
    this.friendship.block(this.store.state.userPage.pk);
  }

  unblockUser: boolean = false;

  _unblockUser(): void {
    this.unblockUser = false;
    this.store.state.userPage.friendship.blocking = false;
    this.friendship.unblock(this.store.state.userPage.pk);
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
    this.feed.followers(this.store.state.userPage.pk).then((data) => {
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
    this.feed.following(this.store.state.userPage.pk).then((data) => {
      this.userFollowing = this.userFollowing.concat(data.following);
    });
  }

  userMutualFollow: any[] = [];
  loadMutualFollow: boolean = false;
  loadedMutualFollow: boolean = false;

  _loadMutualFollow(): void {
    this.loadMutualFollow = true;
    if (!this.loadedMutualFollow) {
      this.__loadMutualFollow();
      this.loadedMutualFollow = true;
    }
  }

  __loadMutualFollow(): void {
    this.feed.followersMutual(this.store.state.userPage.pk).then((data) => {
      this.userMutualFollow = this.userMutualFollow.concat(data.mutuals);
    });
  }

  loadStories: boolean = false;

  openStories(): void {
    if (this.store.state.userPage.reels) {
      this.loadStories = true;
    }
  }
}
