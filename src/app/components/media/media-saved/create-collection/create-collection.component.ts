import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.css']
})

export class CreateCollectionComponent {

  constructor(private http: HttpClient) { }

  collectionName: string = '';
  collectionPosts: any[] = [];
  @Input() fromPost: string = '';
  @Output() onCreate = new EventEmitter();

  private createError() {
    return throwError(() => {
      new Error('Collection error: cannot create collection.');
    });
  }

  collectionCreate(): void {
    if (!(this.collectionName.length > 0)) { return; }
    // Add selected posts for the new collection.
    let selectedPosts = [];
    if (this.fromPost.length > 0) {
      selectedPosts.push(this.fromPost);
    } else {
      for (let post of this.collectionPosts) {
        if (post.add) { selectedPosts.push(post.id); }
      }
    }
    // Create new collection.
    this.http.post<string>('/api/collection/create', {
      medias: selectedPosts, name: this.collectionName,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.createError)).subscribe(() => {
      localStorage.removeItem('collectionCreate');
      this.onCreate.emit();
    });
  }

  collectionGetPosts(more?: boolean): void {
    if (!more) { localStorage.removeItem('collectionCreate'); }
    this.http.post<any>('/api/feed/saved_all', {
      feed: localStorage.getItem('collectionCreate'),
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.createError)).subscribe((data) => {
      localStorage.setItem('collectionCreate', data.feed);
      this.collectionPosts = this.collectionPosts.concat(data.posts);
      this.hideIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
      this.stopIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
    });
  }

  @Output() onClose = new EventEmitter();

  collectionCreateClose(): void {
    localStorage.removeItem('collectionCreate');
    this.onClose.emit();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.collectionGetPosts(true);
  }

  ngOnInit(): void {
    if (!this.fromPost) { this.collectionGetPosts(); }
  }
}
