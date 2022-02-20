import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'viewer-users',
  templateUrl: './viewer-users.component.html',
  styleUrls: ['./viewer-users.component.css']
})

export class ViewerUsersComponent implements OnInit {

  constructor() { }

  @Output() closeSend = new EventEmitter();
  @Output() userSend = new EventEmitter();
  @Output() onScroll = new EventEmitter();

  @Input() usersList: any[] = [];
  @Input() title: string = 'Users';

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem("follow");
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }

  ngOnInit(): void {
  }
}
