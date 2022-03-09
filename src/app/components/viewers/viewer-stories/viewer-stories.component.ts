import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'viewer-stories',
  templateUrl: './viewer-stories.component.html',
  styleUrls: ['./viewer-stories.component.css']
})

export class ViewerStoriesComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  @Output() closeSend = new EventEmitter();

  @Input() feedStories: any[] = [];
  feedStoriesSeen: any[] = [];
  feedIndex: number = 0;

  @Input() originIndex: number = 0;
  originSeen: boolean = false;

  private storiesError() {
    return throwError(() => new Error('Stories error: cannot load stories media information.'));
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
      this.http.post<object[]>('/api/stories_media', { session: localStorage.getItem("state"), stories: stories })
        .pipe(catchError(this.storiesError))).then((data) => {
          console.info('Stories media loaded successfully!'); return data;
        });
    // Load the media items into the stories feed array.
    for (let media in data) {
      let index = this.feedStories.findIndex((story) => story.id == data[media].id)
      if (index) { this.feedStories[index].items = data[media].items; }
    } this.openStories();
  }

  storiesIndex: number = 0;

  openStories(): void {
    this.storiesIndex = 0;
    this.storyIndex();
    this.storySeen();
  }

  closeStories(): void {
    if (this.feedStoriesSeen.length > 0) {
      // Request watched stories to be marked as seen.
      this.http.post('/api/stories_seen', { session: localStorage.getItem("state"), stories: this.feedStoriesSeen }).subscribe();
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
    // Go to the next user stories if it's the las story for the current.
    if (this.storiesIndex == (this.feedStories[this.feedIndex].items.length - 1)) {
      await this.storiesNextSkip();
    } else {
      this.storiesIndex++;
      this.storySeen();
    }
  }

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

  storyIndex(): void {
    // Set user stories starting index point to the first story not seen yet.
    for (let [i, item] of this.feedStories[this.feedIndex].items.entries()) {
      if (item.taken_at > this.feedStories[this.feedIndex].seen) {
        this.storiesIndex = i; break;
      }
    }
  }

  storySeen(): void {
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

  loadUserPage(username: string): void {
    if (this.feedStoriesSeen.length > 0) {
      // Request watched stories to be marked as seen.
      this.http.post('/api/stories_seen', { session: localStorage.getItem("state"), stories: this.feedStoriesSeen }).subscribe();
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
