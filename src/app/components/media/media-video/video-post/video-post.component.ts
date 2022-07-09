import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'video-post',
  templateUrl: './video-post.component.html',
  styleUrls: ['./video-post.component.css']
})

export class VideoPostComponent {

  @Input() post: any;
  @Output() onOpen = new EventEmitter();
}
