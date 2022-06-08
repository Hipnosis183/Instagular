import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})

export class EditCollectionComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Output() onEdit = new EventEmitter();
  @Output() onClose = new EventEmitter();

  @Input() collection: any;
  @Input() collectionSelected: any;

  collectionPosts: any[] = [];

  private editError() {
    return throwError(() => new Error('Collection error: cannot edit collection.'));
  }

  collectionEdit(): void {
    if (!(this.collection.collection_name.length > 0)) { return; }
    // Manage selected posts for the collection.
    let addPosts = [], removePosts = [];
    for (let post of this.collectionPosts) {
      if (post.removeable) {
        if (post.add) { continue; }
        else { removePosts.push(post.id); }
      } if (post.add) { addPosts.push(post.id); }
    }
    // Edit collection with the new information.
    this.http.post<string>('/api/collection/edit', { id: this.collection.collection_id, name: this.collection.collection_name, add: addPosts, remove: removePosts, session: localStorage.getItem('state') })
      .pipe(catchError(this.editError))
      .subscribe((data) => {
        console.info('Collection updated successfully!');
        localStorage.removeItem('collectionEdit');
        this.onEdit.emit();
      });
  }

  async collectionGetPosts(more?: boolean): Promise<void> {
    if (!more) { localStorage.removeItem('collectionEdit'); }
    await lastValueFrom(
      this.http.post<any>('/api/feed/saved_all', { feed: localStorage.getItem('collectionEdit'), session: localStorage.getItem('state') })
        .pipe(catchError(this.editError))).then((data: any) => {
          localStorage.setItem('collectionEdit', data.feed);
          for (let post of this.collectionSelected) {
            let k = data.posts.findIndex((res: any) => res.id == post.id);
            if (data.posts[k]) {
              data.posts[k].add = true;
              data.posts[k].removeable = true;
            }
          }
          this.collectionPosts = this.collectionPosts.concat(data.posts);
          this.hideIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
          this.stopIntersect = JSON.parse(data.feed).moreAvailable ? false : true;
        });
  }

  collectionEditClose(): void {
    localStorage.removeItem('collectionEdit');
    this.onClose.emit();
  }

  hideIntersect: boolean = true;
  stopIntersect: boolean = false;

  onIntersection(): void {
    this.hideIntersect = true;
    this.collectionGetPosts(true);
  }

  async ngOnInit(): Promise<void> {
    await this.collectionGetPosts();
  }
}
