import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'viewer-stories',
  templateUrl: './viewer-stories.component.html',
  styleUrls: ['./viewer-stories.component.css']
})

export class ViewerStoriesComponent {

  constructor(
    private http: HttpClient,
    public router: Router,
  ) { }

  feedIndex: number = 0;
  feedStoriesSeen: any[] = [];
  @Input() feedStories: any[] = [];
  @Input() seenStories: boolean = true;

  private storiesError() {
    return throwError(() => {
      new Error('Stories error: cannot load stories media information.');
    });
  }

  async loadStories(index: number): Promise<void> {
    let stories = [];
    stories.push(this.feedStories[index].id);
    // Set amount of stories media to get behind/ahead.
    const count = 12;
    let countLeft = count / 2;
    let countRight = count / 2;
    // Add fetch slots for stories ahead if previous items are already loaded.
    if (index == 0 || (index > 0 && this.feedStories[index - 1].items)) {
      countRight = countRight + (count / 2);
    }
    // Add fetch slots for stories behind if following items are already loaded.
    if (index == this.feedStories.length - 1
      || index < this.feedStories.length - 1 && this.feedStories[index + 1].items) {
      countLeft = countLeft + (count / 2);
    }
    // Avoid index underflow if count is negative.
    if (index - countLeft < 0) { countLeft = index + 1; } else { countLeft++; }
    // Avoid index overflow if count is greater than max.
    if (index + countRight > this.feedStories.length) {
      countRight = this.feedStories.length - index;
    } else { countRight++; }
    // Manage stories behind.
    if (index > 0 && !this.feedStories[index - 1].items) {
      for (let i = index - 1; i > (index - countLeft); i--) {
        if (!this.feedStories[i].items) {
          // Add stories for media fetch.
          stories.push(this.feedStories[i].id);
        }
      }
    }
    // Manage stories ahead.
    if (index < this.feedStories.length - 1 && !this.feedStories[index + 1].items) {
      for (let i = index + 1; i < (index + countRight); i++) {
        if (!this.feedStories[i].items) {
          // Add stories for media fetch.
          stories.push(this.feedStories[i].id);
        }
      }
    }
    // Fetch selected stories media.
    let data: any = await lastValueFrom(
      this.http.post<any>('/api/feed/reels_media', {
        stories: stories, session: localStorage.getItem('state'),
      }).pipe(catchError(this.storiesError))).then((data) => { return data; });
    // Load the media items into the stories feed array.
    for (let media in data) {
      let index = this.feedStories.findIndex((story) => story.id == data[media].id);
      if (typeof (index) == 'number') { this.feedStories[index].items = data[media].items; }
    } this.openStories();
  }

  storiesIndex: number = 0;

  openStories(): void {
    this.storiesIndex = 0;
    this.storyIndex();
    this.storySeen();
  }

  @Output() closeSend = new EventEmitter();

  closeStories(): void {
    if ((this.feedStoriesSeen.length > 0) && this.seenStories) {
      // Request watched stories to be marked as seen.
      this.http.post('/api/media/seen', {
        stories: this.feedStoriesSeen,
        session: localStorage.getItem('state'),
      }).subscribe();
    }
    this.feedStoriesSeen = [];
    this.closeSend.emit();
  }

  async storiesPrev(): Promise<void> {
    if (this.storiesIndex == 0) {
      await this.storiesPrevSkip(true);
    } else {
      this.storiesIndex--;
      this.storyIndexUpdate();
    }
  }

  async storiesPrevSkip(index?: boolean): Promise<void> {
    // Get user stories if the selected user has none loaded yet.
    if (!this.feedStories[this.feedIndex - 1].items) {
      await this.loadStories(this.feedIndex - 1);
    }
    this.storiesIndex = index ? this.feedStories[this.feedIndex - 1].items.length - 1 : 0;
    this.loadThumbs();
    this.feedIndex--;
    this.storyIndex();
  }

  async storiesNext(): Promise<void> {
    // Go to the next user stories if it's the last story for the current.
    if (this.storiesIndex == (this.feedStories[this.feedIndex].items.length - 1)) {
      await this.storiesNextSkip();
    } else {
      this.storiesIndex++;
      this.storyIndexUpdate();
      this.storySeen();
    }
  }

  originSeen: boolean = false;
  @Input() originIndex: number = 0;

  async storiesNextSkip(): Promise<void> {
    // Close the viewer if it's the last story for the last user.
    if ((this.feedIndex == (this.feedStories.length - 1) ||
      (!this.originSeen && this.feedStories[this.feedIndex + 1].seen == this.feedStories[this.feedIndex + 1].latest_reel_media))) {
      setTimeout(() => { this.closeStories(); });
    } else {
      // Get user stories if the selected user has none loaded yet.
      if (!this.feedStories[this.feedIndex + 1].items) {
        await this.loadStories(this.feedIndex + 1);
      }
      this.storiesIndex = 0;
      this.loadThumbs();
      this.feedIndex++;
      this.storyIndex();
      this.storySeen();
    }
  }

  @HostListener('window:keydown', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    event.preventDefault();
    // Go to the next story if the right arrow key is pressed.
    if (event.key == 'ArrowRight') {
      if (event.ctrlKey) {
        if (this.feedStories.length > 1) {
          await this.storiesNextSkip();
        }
      } else { await this.storiesNext(); }
    }
    // Go to the previous story if the left arrow key is pressed.
    if (event.key == 'ArrowLeft') {
      if (event.ctrlKey) {
        if (this.feedStories.length > 1 && this.feedIndex > 0) {
          await this.storiesPrevSkip();
        }
      } else if (this.feedIndex > 0 || this.storiesIndex > 0) {
        await this.storiesPrev();
      }
    }
    // Close thumbs panel if the space key is pressed.
    if (event.key == ' ') { this.expandThumbs(); }
    // Close viewer if the escape key is pressed.
    if (event.key == 'Escape') { this.closeStories(); }
  }

  expandedThumbs: boolean = false;
  loadedThumbs: boolean = false;

  expandThumbs(): void {
    this.expandedThumbs = !this.expandedThumbs;
    if (!this.loadedThumbs) {
      this.loadedThumbs = true;
    }
  }

  loadThumbs(): void {
    if (!this.expandedThumbs) {
      this.loadedThumbs = false;
    }
  }

  storySelect(index: number): void {
    this.storiesIndex = index;
    this.storyIndexUpdate();
  }

  storyIndex(): void {
    // Set user stories starting index point to the first story not seen yet.
    if (this.feedStories[this.feedIndex].seen) {
      for (let [i, item] of this.feedStories[this.feedIndex].items.entries()) {
        if (item.taken_at > this.feedStories[this.feedIndex].seen) {
          this.storiesIndex = i;
          this.storyIndexUpdate(); break;
        }
      }
    } else { this.storyIndexUpdate(); }
  }

  storyIndexUpdate(): void {
    setTimeout(() => {
      let element: any = document.querySelector('.count-dots');
      if (element) {
        let child = element.children.item(this.storiesIndex);
        // Activate element without focusing.
        element.blur();
        // Center selected dot in the parent container.
        child.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    });
  }

  storySeen(): void {
    // Continue if it's a user story (avoid highlights).
    if ((this.feedStories[this.feedIndex].reel_type == 'user_reel') && this.seenStories) {
      // Check if the story has been seen already and add it to the seen list if not.
      if (!(this.feedStories[this.feedIndex].seen >= this.feedStories[this.feedIndex].items[this.storiesIndex].taken_at)) {
        if (this.feedStoriesSeen.findIndex((item) => item.pk == this.feedStories[this.feedIndex].items[this.storiesIndex].pk)) {
          // Leave only the necessary data to avoid payload overload errors.
          let storyStrip = {
            id: this.feedStories[this.feedIndex].items[this.storiesIndex].id,
            user: this.feedStories[this.feedIndex].items[this.storiesIndex].user,
            taken_at: this.feedStories[this.feedIndex].items[this.storiesIndex].taken_at
          };
          // Add story to the seen array to be sent, and update the status in the local list.
          this.feedStoriesSeen.push(storyStrip);
          this.feedStories[this.feedIndex].seen = this.feedStories[this.feedIndex].items[this.storiesIndex].taken_at + 1;
        }
      }
    }
  }

  loadUserPage(username: string): void {
    if ((this.feedStoriesSeen.length > 0) && this.seenStories) {
      // Request watched stories to be marked as seen.
      this.http.post('/api/media/seen', {
        stories: this.feedStoriesSeen,
        session: localStorage.getItem('state'),
      }).subscribe();
    }
    this.router.navigate(['/' + username]);
  }

  ngOnInit(): void {
    // Set stories user index for navigation.
    this.feedIndex = this.originIndex;
    // Set clicked user original seen status.
    this.originSeen = this.feedStories[this.feedIndex].seen == this.feedStories[this.feedIndex].latest_reel_media
    if (!this.feedStories[this.feedIndex].items) {
      // Get user stories if the selected user has none loaded yet.
      this.loadStories(this.originIndex);
    } else { this.openStories(); }
  }
}
