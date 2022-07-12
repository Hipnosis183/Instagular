import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    public store: StoreService,
  ) { }

  @Input() usersList: any[] = [];
  @Input() usersTitle: string = '';
  @Output() onClose = new EventEmitter();

  loadUserPage(username: string): void {
    this.router.navigate(['/' + username]);
  }

  followUser(i: number): void {
    this.usersList[i].friendship.following = true;
    this.friendship.follow(this.usersList[i].pk);
  }

  unfollowUser(i: number): void {
    this.usersList[i].friendship.following = false;
    this.friendship.unfollow(this.usersList[i].pk);
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
