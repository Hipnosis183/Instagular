import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DelayService } from 'src/app/services/delay.service';

@Component({
  selector: 'media-stories',
  templateUrl: './media-stories.component.html',
  styleUrls: ['./media-stories.component.css']
})

export class MediaStoriesComponent {

  constructor(private delay: DelayService) { }

  feedLoaded: boolean = true;
  originIndex: number = 0;
  storiesShow: boolean = false;

  openStories(index: number): void {
    this.originIndex = index;
    this.storiesShow = true;
  }

  closeStories(): void {
    this.storiesShow = false;
  }

  @Output() onReload = new EventEmitter();

  reloadFeed(feed: string): void {
    this.feedLoaded = false;
    this.selectModel = null;
    this.onReload.emit(feed);
  }

  selectModel: any = null;
  _selectModel: any = null;
  @Input() feedStories: any[] = [];

  updateValueDebounced = this.delay.debounce(() => this.updateValue(), 1000);
  updateValue(): void {
    this._selectModel = this.selectModel;
    if (this.selectModel && this.selectModel.length > 0) {
      for (let [i, story] of this.feedStories.entries()) {
        this.feedStories[i].hidden = story.user.username.includes(this.selectModel.toLowerCase()) ? false : true;
      }
    }
  }

  clearValue(): void {
    this.selectModel = null;
    this.updateValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Necessary for the tooltip array to work after a reload.
    if (changes['feedStories'].currentValue.length > 0) {
      this.feedLoaded = true;
    }
  }
}
