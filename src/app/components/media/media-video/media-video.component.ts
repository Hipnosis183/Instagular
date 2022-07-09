import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'media-video',
  templateUrl: './media-video.component.html',
  styleUrls: ['./media-video.component.css']
})

export class MediaVideoComponent {

  constructor(private media: MediaService) { }

  feedIndex: any = { current: null, total: null };
  feedPost: any = null;
  @Input() feedPosts: any[] = [];

  openMedia(post: any): void {
    // If the media information hasn't been requested yet.
    if (!post.node.instagular) {
      this.media.video(post.node.shortcode).then((data) => {
        this.feedPost = data;
        this.feedIndex.current = this.feedPosts.findIndex((res) => res.node.id == post.node.id);
        this.feedIndex.total = this.feedPosts.length - 1;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
      this.feedIndex.current = this.feedPosts.findIndex((res) => res.node.id == post.node.id);
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  prevPost(): void {
    this.feedIndex.current--;
    // If the media information hasn't been requested yet.
    if (!this.feedPosts[this.feedIndex.current].node.instagular) {
      this.media.video(this.feedPosts[this.feedIndex.current].node.shortcode).then((data) => {
        this.feedPost = data;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  nextPost(): void {
    this.feedIndex.current++;
    // If the media information hasn't been requested yet.
    if (!this.feedPosts[this.feedIndex.current].node.instagular) {
      this.media.video(this.feedPosts[this.feedIndex.current].node.shortcode).then((data) => {
        this.feedPost = data;
        // Store results to avoid further request for the selected media.
        this.feedPosts[this.feedIndex.current].node.instagular = data;
      });
    } else {
      this.feedPost = this.feedPosts[this.feedIndex.current].node.instagular;
    }
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;
  @Output() onScroll = new EventEmitter();

  onIntersection(): void {
    this.hideIntersect = true;
    this.onScroll.emit();
  }

  ngOnChanges(): void {
    const feed: any = localStorage.getItem('video');
    this.hideIntersect = JSON.parse(feed).moreAvailable ? false : true;
    this.stopIntersect = JSON.parse(feed).moreAvailable ? false : true;
  }
}
