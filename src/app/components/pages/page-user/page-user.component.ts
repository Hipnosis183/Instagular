import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})

export class PageUserComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private title: Title,
    public store: StoreService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  feedSelected: string = 'timeline';
  feedLoaded: any = {
    timeline: false,
    reels: false,
    video: false,
    tagged: false,
    saved: false
  };

  async feedTimeline(): Promise<void> {
    this.feedSelected = 'timeline';
    this.location.go(this.userProfile.username);
    if (!this.feedLoaded.timeline) {
      await this.loadUser();
      this.feedLoaded.timeline = true;
    }
  }

  async feedReels(): Promise<void> {
    if (this.userProfile.total_clips_count) {
      this.feedSelected = 'reels';
      this.location.go(this.userProfile.username + '/reels');
      if (!this.feedLoaded.reels) {
        await this.loadReels();
        this.feedLoaded.reels = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedVideo(): Promise<void> {
    if (this.userProfile.has_videos) {
      this.feedSelected = 'video';
      this.location.go(this.userProfile.username + '/channel');
      if (!this.feedLoaded.video) {
        await this.loadVideo();
        this.feedLoaded.video = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedTagged(): Promise<void> {
    if (this.userProfile.usertags_count) {
      this.feedSelected = 'tagged';
      this.location.go(this.userProfile.username + '/tagged');
      if (!this.feedLoaded.tagged) {
        await this.loadTagged();
        this.feedLoaded.tagged = true;
      }
    } else { this.feedTimeline(); }
  }

  feedSavedUrl: string = '';

  async feedSaved(): Promise<void> {
    if (this.userProfile.has_saved_items) {
      this.feedSelected = 'saved';
      this.location.go(this.userProfile.username + '/saved' + this.feedSavedUrl);
    } else { this.feedTimeline(); }
  }

  userName: any = '';
  userNotFound: boolean = false;
  userPosts: any[] = [];
  userProfile: any = null;
  userReels: any[] = [];
  userStories: any[] = [];
  userTagged: any[] = [];
  userVideos: any[] = [];

  loadTabs(): void {
    if (!this.userProfile.is_private || (this.userProfile.is_private && this.userProfile.friendship.following)) {
      let tab = this.route.snapshot.paramMap.get('tab');
      switch (tab) {
        case 'reels': { this.feedReels(); break; }
        case 'channel': { this.feedVideo(); break; }
        case 'tagged': { this.feedTagged(); break; }
        case 'saved': { this.feedSaved(); break; }
        default: { this.feedTimeline(); break; }
      }
    }
  }

  private profileError() {
    this.title.setTitle('Page not found · Instagular');
    this.userNotFound = true; return of();
    return throwError(() => new Error('Profile error: cannot load user profile information.'));
  }

  async loadProfile(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/user/profile', { id: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem('state'), stories: true })
        .pipe(catchError(this.profileError.bind(this)))).then(async (data: any) => {
          console.info('Profile loaded successfully!');
          this.userProfile = data;
          this.title.setTitle(`${data.full_name ? data.full_name : data.username} (@${data.username})`);
        });
  }

  private userError() {
    return throwError(() => new Error('User error: cannot load user media.'));
  }

  async loadUser(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/user', { feed: localStorage.getItem('feed'), id: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem('state') })
        .pipe(catchError(this.userError))).then((data: any) => {
          console.info('User loaded successfully!');
          localStorage.setItem('feed', data.feed);
          this.userPosts = this.userPosts.concat(data.posts);
        });
  }

  private reelsError() {
    return throwError(() => new Error('Reels error: cannot load user reels feed.'));
  }

  async loadReels(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/reels', { id: this.userProfile.pk, session: localStorage.getItem('state'), cursor: localStorage.getItem('reels') })
        .pipe(catchError(this.reelsError))).then((data: any) => {
          console.info('User reels feed loaded successfully!');
          localStorage.setItem('reels', data.cursor);
          this.userReels = this.userReels.concat(data.posts);
        });
  }

  private videoError() {
    return throwError(() => new Error('Video error: cannot load user Video (IGTV) feed.'));
  }

  async loadVideo(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/video', { id: this.userProfile.pk, name: this.route.snapshot.paramMap.get('id'), session: localStorage.getItem('state'), cursor: localStorage.getItem('video') })
        .pipe(catchError(this.videoError))).then((data: any) => {
          console.info('User Video feed loaded successfully!');
          localStorage.setItem('video', data.cursor);
          this.userVideos = this.userVideos.concat(data.posts);
        });
  }

  private taggedError() {
    return throwError(() => new Error('Tagged error: cannot load user tagged posts feed.'));
  }

  async loadTagged(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/tagged', { feed: localStorage.getItem('tagged'), id: this.userProfile.pk, session: localStorage.getItem('state') })
        .pipe(catchError(this.taggedError))).then((data: any) => {
          console.info('User tagged feed loaded successfully!');
          localStorage.setItem('tagged', data.feed);
          this.userTagged = this.userTagged.concat(data.posts);
        });
  }

  loadSaved(): void {
    if (this.userProfile.has_saved_items && this.store.state.savedPosts.length > 0) {
      this.feedLoaded.saved = true;
    }
  }

  private storiesError() {
    return throwError(() => new Error('Stories error: cannot load stories tray information.'));
  }

  async loadStories(): Promise<void> {
    await lastValueFrom(this.http.post<object[]>('/api/highlights/highlights_tray', { id: this.userProfile.pk, session: localStorage.getItem('state') })
      .pipe(catchError(this.storiesError))).then((data: any) => {
        console.info('Stories tray loaded successfully!');
        this.userStories = this.userStories.concat(data);
      });
  }

  private followError() {
    return throwError(() => new Error('Following error: could not follow user.'));
  }

  followUser(): void {
    this.http.post('/api/friendship/follow', { userId: this.userProfile.pk, session: localStorage.getItem('state') })
      .pipe(catchError(this.followError))
      .subscribe((data) => {
        console.info('User followed successfully!');
        this.userProfile.friendship.following = true;
      });
  }

  private unfollowError() {
    return throwError(() => new Error('Unfollowing error: could not unfollow user.'));
  }

  unfollowUser(): void {
    this.http.post('/api/friendship/unfollow', { userId: this.userProfile.pk, session: localStorage.getItem('state') })
      .pipe(catchError(this.unfollowError))
      .subscribe((data) => {
        console.info('User unfollowed successfully :(');
        this.userProfile.friendship.following = false;
      });
  }

  listIndex: number = 0;
  listTitle: string = '';
  usersList: any[] = [];

  private followersError() {
    return throwError(() => new Error('Followers error: cannot load followers information.'));
  }

  loadFollowers(): void {
    this.http.post<object[]>('/api/feed/followers', { feed: localStorage.getItem('follow'), id: this.userProfile.pk, session: localStorage.getItem('state') })
      .pipe(catchError(this.followersError))
      .subscribe((data: any) => {
        console.info('Followers loaded successfully!');
        localStorage.setItem('follow', data.feed);
        this.listIndex = 0;
        this.listTitle = 'Followers';
        this.usersList = this.usersList.concat(data.followers);
      });
  }

  private followingError() {
    return throwError(() => new Error('Following error: cannot load following information.'));
  }

  loadFollowing(): void {
    this.http.post<object[]>('/api/feed/following', { feed: localStorage.getItem('follow'), id: this.userProfile.pk, session: localStorage.getItem('state') })
      .pipe(catchError(this.followingError))
      .subscribe((data: any) => {
        console.info('Following loaded successfully!');
        localStorage.setItem('follow', data.feed);
        this.listIndex = 1;
        this.listTitle = 'Following';
        this.usersList = this.usersList.concat(data.following);
      });
  }

  loadUserPage(username: string): void {
    localStorage.removeItem('follow');
    this.router.navigate(['/' + username]);
  }

  closeUsers(): void {
    this.usersList = [];
    localStorage.removeItem('follow');
  }

  storiesShow: boolean = false;

  openStories(): void {
    if (this.userProfile.reels) {
      this.storiesShow = true;
    }
  }

  closeStories(): void {
    this.storiesShow = false;
  }

  async ngOnInit(): Promise<void> {
    this.userName = localStorage.getItem('username');
    localStorage.removeItem('feed');
    localStorage.removeItem('reels');
    localStorage.removeItem('video');
    localStorage.removeItem('tagged');
    localStorage.removeItem('collection');
    localStorage.removeItem('follow');
    await this.loadProfile();
    await this.loadStories();
    this.loadSaved();
    this.loadTabs();
  }

  ngOnDestroy(): void {
    this.title.setTitle('Instagular');
  }
}
