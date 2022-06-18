import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})

export class PageUserComponent {

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private title: Title,
    public store: StoreService,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  feedSelect: string = 'timeline';
  feedSelected: any = {
    timeline: false,
    reels: false,
    video: false,
    tagged: false
  };
  feedLoaded: any = {
    timeline: false,
    reels: false,
    video: false,
    tagged: false,
    saved: false,
    followers: false,
    following: false,
  };

  async feedTimeline(): Promise<void> {
    this.feedSelect = 'timeline';
    this.location.go(this.userProfile.username);
    if (!this.feedSelected.timeline) {
      this.feedSelected.timeline = true;
      await this.loadUser();
      this.feedLoaded.timeline = true;
    }
  }

  async feedReels(): Promise<void> {
    if (this.userProfile.total_clips_count) {
      this.feedSelect = 'reels';
      this.location.go(this.userProfile.username + '/reels');
      if (!this.feedSelected.reels) {
        this.feedSelected.reels = true;
        await this.loadReels();
        this.feedLoaded.reels = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedVideo(): Promise<void> {
    if (this.userProfile.has_videos) {
      this.feedSelect = 'video';
      this.location.go(this.userProfile.username + '/channel');
      if (!this.feedSelected.video) {
        this.feedSelected.video = true;
        await this.loadVideo();
        this.feedLoaded.video = true;
      }
    } else { this.feedTimeline(); }
  }

  async feedTagged(): Promise<void> {
    if (this.userProfile.usertags_count) {
      this.feedSelect = 'tagged';
      this.location.go(this.userProfile.username + '/tagged');
      if (!this.feedSelected.tagged) {
        this.feedSelected.tagged = true;
        await this.loadTagged();
        this.feedLoaded.tagged = true;
      }
    } else { this.feedTimeline(); }
  }

  feedSavedUrl: string = '';

  async feedSaved(): Promise<void> {
    if (this.userProfile.has_saved_items) {
      this.feedSelect = 'saved';
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
    this.title.setTitle('Page not found • Instagular');
    this.userNotFound = true; return of();
    return throwError(() => {
      new Error('Profile error: cannot load user profile information.');
    });
  }

  async loadProfile(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/user/profile', {
        id: this.route.snapshot.paramMap.get('id'), stories: true,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.profileError.bind(this)))).then((data) => {
        this.userProfile = data;
        this.title.setTitle(`${data.full_name ? data.full_name : data.username} (@${data.username})`);
      });
  }

  private userError() {
    return throwError(() => {
      new Error('User error: cannot load user media.');
    });
  }

  async loadUser(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/user', {
        feed: localStorage.getItem('feed'),
        id: this.route.snapshot.paramMap.get('id'),
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.userError))).then((data) => {
        localStorage.setItem('feed', data.feed);
        this.userPosts = this.userPosts.concat(data.posts);
      });
  }

  private reelsError() {
    return throwError(() => {
      new Error('Reels error: cannot load user reels feed.');
    });
  }

  async loadReels(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/reels', {
        id: this.userProfile.pk,
        cursor: localStorage.getItem('reels'),
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.reelsError))).then((data) => {
        localStorage.setItem('reels', data.cursor);
        this.userReels = this.userReels.concat(data.posts);
      });
  }

  private videoError() {
    return throwError(() => {
      new Error('Video error: cannot load user Video (IGTV) feed.');
    });
  }

  async loadVideo(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/video', {
        feed: localStorage.getItem('video'),
        id: this.userProfile.pk,
        name: this.route.snapshot.paramMap.get('id'),
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.videoError))).then((data) => {
        localStorage.setItem('video', data.feed);
        this.userVideos = this.userVideos.concat(data.posts);
      });
  }

  private taggedError() {
    return throwError(() => {
      new Error('Tagged error: cannot load user tagged posts feed.');
    });
  }

  async loadTagged(): Promise<void> {
    await lastValueFrom(
      this.http.post<any>('/api/feed/tagged', {
        feed: localStorage.getItem('tagged'),
        id: this.userProfile.pk,
        session: localStorage.getItem('state'),
      }).pipe(catchError(this.taggedError))).then((data) => {
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
    return throwError(() => {
      new Error('Stories error: cannot load stories tray information.');
    });
  }

  async loadStories(): Promise<void> {
    await lastValueFrom(this.http.post<any>('/api/highlights/highlights_tray', {
      id: this.userProfile.pk,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.storiesError))).then((data) => {
      this.userStories = this.userStories.concat(data);
    });
  }

  private followError() {
    return throwError(() => {
      new Error('Following error: could not follow user.');
    });
  }

  followUser(): void {
    this.userProfile.friendship.following = true;
    this.http.post('/api/friendship/follow', {
      userId: this.userProfile.pk,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.followError));
  }

  private unfollowError() {
    return throwError(() => {
      new Error('Unfollowing error: could not unfollow user.');
    });
  }

  unfollowUser(): void {
    this.userProfile.friendship.following = false;
    this.http.post('/api/friendship/unfollow', {
      userId: this.userProfile.pk,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.unfollowError));
  }

  userFollowers: any[] = [];
  userFollowing: any[] = [];
  showFollowers: boolean = false;
  showFollowing: boolean = false;

  private followersError() {
    return throwError(() => {
      new Error('Followers error: cannot load followers information.');
    });
  }

  _loadFollowers(): void {
    this.openFollowers();
    if (!this.feedLoaded.followers) {
      this.loadFollowers();
      this.feedLoaded.followers = true;
    }
  }
  loadFollowers(): void {
    this.http.post<any>('/api/feed/followers', {
      feed: localStorage.getItem('followers'),
      id: this.userProfile.pk,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.followersError)).subscribe((data) => {
      localStorage.setItem('followers', data.feed);
      this.userFollowers = this.userFollowers.concat(data.followers);
    });
  }

  openFollowers(): void {
    this.showFollowers = !this.showFollowers;
  }

  private followingError() {
    return throwError(() => new Error('Following error: cannot load following information.'));
  }

  _loadFollowing(): void {
    this.openFollowing();
    if (!this.feedLoaded.following) {
      this.loadFollowing();
      this.feedLoaded.following = true;
    }
  }
  loadFollowing(): void {
    this.http.post<any>('/api/feed/following', {
      feed: localStorage.getItem('following'),
      id: this.userProfile.pk,
      session: localStorage.getItem('state'),
    }).pipe(catchError(this.followingError)).subscribe((data) => {
      localStorage.setItem('following', data.feed);
      this.userFollowing = this.userFollowing.concat(data.following);
    });
  }

  openFollowing(): void {
    this.showFollowing = !this.showFollowing;
  }

  showStories: boolean = false;

  openStories(): void {
    if (this.userProfile.reels) {
      this.showStories = true;
    }
  }

  closeStories(): void {
    this.showStories = false;
  }

  async ngOnInit(): Promise<void> {
    this.userName = localStorage.getItem('username');
    localStorage.removeItem('feed');
    localStorage.removeItem('reels');
    localStorage.removeItem('video');
    localStorage.removeItem('tagged');
    localStorage.removeItem('collection');
    localStorage.removeItem('followers');
    localStorage.removeItem('following');
    await this.loadProfile();
    await this.loadStories();
    this.loadSaved();
    this.loadTabs();
  }

  ngOnDestroy(): void {
    this.title.setTitle('Instagular');
  }
}
