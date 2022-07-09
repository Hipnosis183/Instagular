import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'media-reels',
  templateUrl: './media-reels.component.html',
  styleUrls: ['./media-reels.component.css']
})

export class MediaReelsComponent {

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];

  openMedia(post: any): void {
    this.feedPost = post;
    this.feedIndex.current = this.feedPosts.findIndex((res) => res.id == post.id);
    this.feedIndex.total = this.feedPosts.length - 1;
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
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const cursor: any = localStorage.getItem('reels');
    this.hideIntersect = cursor ? false : true;
    this.stopIntersect = cursor ? false : true;
  }
}
