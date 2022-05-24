import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'media-video',
  templateUrl: './media-video.component.html',
  styleUrls: ['./media-video.component.css']
})

export class MediaVideoComponent implements OnInit {

  constructor() { }

  @Input() feedPosts: any[] = [];

  @Output() onScroll = new EventEmitter();

  feedPost: any = null;
  feedIndex: any = { current: null, total: null };

  openMedia(post: any): void {
    this.feedPost = post;
    this.feedIndex.current = this.feedPosts.findIndex((res) => res.id == post.id);
    this.feedIndex.total = this.feedPosts.length - 1;
  }

  closeMedia(): void {
    this.feedPost = null;
  }

  prevPost(): void {
    this.feedIndex.current--;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  nextPost(): void {
    this.feedIndex.current++;
    this.feedPost = this.feedPosts[this.feedIndex.current];
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const cursor: any = localStorage.getItem("cursor");
    this.hideIntersect = cursor ? false : true;
    this.stopIntersect = cursor ? false : true;
  }

  ngOnInit(): void {
  }
}
