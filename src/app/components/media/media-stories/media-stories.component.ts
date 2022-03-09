import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'media-stories',
  templateUrl: './media-stories.component.html',
  styleUrls: ['./media-stories.component.css']
})

export class MediaStoriesComponent implements OnInit {

  constructor() { }

  @Input() feedStories: any[] = [];
  originIndex: number = 0;
  storiesShow: boolean = false;

  openStories(index: number): void {
    this.originIndex = index;
    this.storiesShow = true;
  }

  closeStories(): void {
    this.storiesShow = false;
  }

  ngOnInit(): void {
  }
}
