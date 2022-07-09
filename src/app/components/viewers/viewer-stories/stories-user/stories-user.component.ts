import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stories-user',
  templateUrl: './stories-user.component.html',
  styleUrls: ['./stories-user.component.css']
})

export class StoriesUserComponent {

  @Input() feedStories: any;
  @Input() feedIndex: number = 0;
  @Input() storiesIndex: number = 0;
  @Output() onUser = new EventEmitter();
}
