import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendshipService } from 'src/app/services/friendship.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'viewer-users',
  templateUrl: './viewer-users.component.html',
  styleUrls: ['./viewer-users.component.css']
})

export class ViewerUsersComponent {

  constructor(
    private friendship: FriendshipService,
    private route: ActivatedRoute,
    private router: Router,
    public store: StoreService,
  ) { }

  @Input() usersList: any[] = [];
  @Input() usersTitle: string = '';
  @Output() onClose = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  loadUserPage(username: string): void {
    this.router.navigate(['/' + username]);
  }

  followUser(i: number): void {
    this.usersList[i].friendship.following = true;
    this.friendship.follow(this.usersList[i].pk);
  }

  qlFollowUser(i: number): void {
    this.usersList[i].followed_by_viewer = true;
    this.friendship.follow(this.usersList[i].id);
  }

  unfollowUser: any = null;

  _unfollowUser(i: number): void {
    this.unfollowUser = null;
    this.usersList[i].friendship.following = false;
    this.usersList[i].friendship.is_bestie = false;
    this.usersList[i].friendship.is_feed_favorite = false;
    this.friendship.unfollow(this.usersList[i].pk);
  }

  qlUnfollowUser(i: number): void {
    this.unfollowUser = null;
    this.usersList[i].followed_by_viewer = false;
    this.friendship.unfollow(this.usersList[i].id);
  }

  addBestie(i: number): void {
    this.usersList[i].friendship.is_bestie = true;
    this.friendship.setBesties([this.usersList[i].pk], []);
  }

  removeBestie(i: number): void {
    this.usersList[i].friendship.is_bestie = false;
    this.friendship.setBesties([], [this.usersList[i].pk]);
  }

  addFavorite(i: number): void {
    this.usersList[i].friendship.is_feed_favorite = true;
    this.friendship.updateFeedFavorites([this.usersList[i].pk], []);
  }

  removeFavorite(i: number): void {
    this.usersList[i].friendship.is_feed_favorite = false;
    this.friendship.updateFeedFavorites([], [this.usersList[i].pk]);
  }

  userName: any = this.route.snapshot.paramMap.get('id');
  removeFollower: any = null;

  _removeFollower(i: number): void {
    this.friendship.removeFollower(this.usersList[i].pk);
    this.usersList.splice(i, 1);
    this.removeFollower = null;
    this.onRemove.emit();
  }

  blockUser: any = null;

  _blockUser(i: number): void {
    this.friendship.block(this.usersList[i].pk);
    this.usersList.splice(i, 1);
    this.blockUser = null;
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  @Input() feedStorage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['usersList'].firstChange) {
      const feed: any = localStorage.getItem(this.feedStorage);
      this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
    }
  }
}
