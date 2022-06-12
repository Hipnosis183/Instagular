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
    // Set amount of stories media to get ahead.
    let count = 10;
    if (index + count > this.feedStories.length) {
      // Avoid index overflow if count is greater than max.
      count = this.feedStories.length - index;
    }
    for (let i = index; i < (index + count); i++) {
      // Add stories to get the media for.
      stories.push(this.feedStories[i].id);
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

  storiesPrev(): void {
    if (this.storiesIndex == 0) {
      this.storiesIndex = this.feedStories[this.feedIndex - 1].items.length - 1;
      this.feedIndex--;
    } else {
      this.storiesIndex--;
    }
  }

  storiesPrevSkip(): void {
    this.storiesIndex = 0;
    this.feedIndex--;
    this.storyIndex();
  }

  async storiesNext(): Promise<void> {
    // Go to the next user stories if it's the last story for the current.
    if (this.storiesIndex == (this.feedStories[this.feedIndex].items.length - 1)) {
      await this.storiesNextSkip();
    } else {
      this.storiesIndex++;
      this.storySeen();
    }
  }

  originSeen: boolean = false;
  @Input() originIndex: number = 0;

  async storiesNextSkip(): Promise<void> {
    // Close the viewer if it's the last story for the last user.
    if ((this.feedIndex == (this.feedStories.length - 1) ||
      (!this.originSeen && this.feedStories[this.feedIndex + 1].seen == this.feedStories[this.feedIndex + 1].latest_reel_media))) {
      this.closeStories();
    } else {
      // Get user stories if the selected user has none loaded yet.
      if (!this.feedStories[this.feedIndex + 1].items) { await this.loadStories(this.feedIndex + 1); }
      this.storiesIndex = 0;
      this.feedIndex++;
      this.storyIndex();
      this.storySeen();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // Go to the next story if the right arrow key is pressed.
    if (event.key == 'ArrowRight') {
      if (event.ctrlKey) {
        if (this.feedStories.length > 1) {
          this.storiesNextSkip();
        }
      } else { this.storiesNext(); }
    }
    // Go to the previous story if the left arrow key is pressed.
    if (event.key == 'ArrowLeft') {
      if (event.ctrlKey) {
        if (this.feedStories.length > 1 && (this.feedIndex > this.originIndex && this.storiesIndex > 0)) {
          this.storiesPrevSkip();
        }
      } else if (this.feedIndex > this.originIndex || this.storiesIndex > 0) {
        this.storiesPrev();
      }
    }
  }

  storyIndex(): void {
    // Set user stories starting index point to the first story not seen yet.
    for (let [i, item] of this.feedStories[this.feedIndex].items.entries()) {
      if (item.taken_at > this.feedStories[this.feedIndex].seen) {
        this.storiesIndex = i; break;
      }
    }
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
