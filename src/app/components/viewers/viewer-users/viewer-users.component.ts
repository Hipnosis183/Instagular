import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'viewer-users',
  templateUrl: './viewer-users.component.html',
  styleUrls: ['./viewer-users.component.css']
})

export class ViewerUsersComponent {

  constructor() { }

  @Input() usersList: any[] = [];
  @Input() title: string = 'Users';
  @Output() closeSend = new EventEmitter();
  @Output() userSend = new EventEmitter();

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem('follow');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }
}
