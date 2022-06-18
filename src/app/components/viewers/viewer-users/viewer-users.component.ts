import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'viewer-users',
  templateUrl: './viewer-users.component.html',
  styleUrls: ['./viewer-users.component.css']
})

export class ViewerUsersComponent {

  constructor(public router: Router) { }

  @Input() usersList: any[] = [];
  @Input() usersTitle: string = 'Users';
  @Output() closeSend = new EventEmitter();

  loadUserPage(username: string): void {
    this.router.navigate(['/' + username]);
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
