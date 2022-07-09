import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reels-post',
  templateUrl: './reels-post.component.html',
  styleUrls: ['./reels-post.component.css']
})

export class ReelsPostComponent {

  @Input() post: any;
  @Output() onOpen = new EventEmitter();
}
