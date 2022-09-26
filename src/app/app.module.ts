import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// App components.
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MediaFeedComponent } from './components/media/media-feed/media-feed.component';
import { FeedPostComponent } from './components/media/media-feed/feed-post/feed-post.component';
import { MediaFooterComponent } from './components/media/media-footer/media-footer.component';
import { MediaReelsComponent } from './components/media/media-reels/media-reels.component';
import { ReelsPostComponent } from './components/media/media-reels/reels-post/reels-post.component';
import { MediaSavedComponent } from './components/media/media-saved/media-saved.component';
import { CollectionComponent } from './components/media/media-saved/collection/collection.component';
import { CreateCollectionComponent } from './components/media/media-saved/create-collection/create-collection.component';
import { EditCollectionComponent } from './components/media/media-saved/edit-collection/edit-collection.component';
import { DeleteCollectionComponent } from './components/media/media-saved/delete-collection/delete-collection.component';
import { MediaStoriesComponent } from './components/media/media-stories/media-stories.component';
import { MediaVideoComponent } from './components/media/media-video/media-video.component';
import { VideoPostComponent } from './components/media/media-video/video-post/video-post.component';
import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageLoginComponent } from './components/pages/page-login/page-login.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { UserBarComponent } from './components/pages/page-user/user-bar/user-bar.component';
import { UserFeedsComponent } from './components/pages/page-user/user-feeds/user-feeds.component';
import { UserProfileComponent } from './components/pages/page-user/user-profile/user-profile.component';
import { SearchComponent } from './components/search/search.component';
import { SearchBoxComponent } from './components/search/search-box/search-box.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserOptionsComponent } from './components/sidenav/user-options/user-options.component';
import { ViewerPostsComponent } from './components/viewers/viewer-posts/viewer-posts.component';
import { PostCommentComponent } from './components/viewers/viewer-posts/post-comment/post-comment.component';
import { PostCommentsComponent } from './components/viewers/viewer-posts/post-comments/post-comments.component';
import { PostPanelComponent } from './components/viewers/viewer-posts/post-panel/post-panel.component';
import { ViewerStoriesComponent } from './components/viewers/viewer-stories/viewer-stories.component';
import { StoriesUserComponent } from './components/viewers/viewer-stories/stories-user/stories-user.component';
import { ViewerUsersComponent } from './components/viewers/viewer-users/viewer-users.component';

// Utility components.
import { DialogComponent } from './utils/dialog/dialog.component';
import { ImgAwaitComponent } from './utils/img-await/img-await.component';
import { ModalComponent } from './utils/modal/modal.component';
import { RadioComponent } from './utils/radio/radio.component';
import { SwitchComponent } from './utils/switch/switch.component';

// Directives.
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import { TooltipArrayDirective } from './directives/tooltip-array.directive';
import { TooltipDirective } from './directives/tooltip.directive';

// Pipes.
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { EncodePipe } from './pipes/encode.pipe';
import { ParseUrlsPipe } from './pipes/parse-urls.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';

// Translate service setup.
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

function appInitializerFactory(translate: TranslateService) {
  return () => {
    let language = localStorage.getItem('language') || 'en';
    translate.addLangs(['en, es']);
    translate.setDefaultLang(language);
    return translate.use(language).toPromise();
  };
}

@NgModule({
  declarations: [
    // App components.
    AppComponent,
    MediaFeedComponent,
    FeedPostComponent,
    MediaFooterComponent,
    MediaReelsComponent,
    ReelsPostComponent,
    MediaSavedComponent,
    CollectionComponent,
    CreateCollectionComponent,
    EditCollectionComponent,
    DeleteCollectionComponent,
    MediaStoriesComponent,
    MediaVideoComponent,
    VideoPostComponent,
    PageFeedComponent,
    PageLoginComponent,
    PageUserComponent,
    UserBarComponent,
    UserFeedsComponent,
    UserProfileComponent,
    SearchComponent,
    SearchBoxComponent,
    SettingsComponent,
    SidenavComponent,
    UserOptionsComponent,
    ViewerPostsComponent,
    PostCommentComponent,
    PostCommentsComponent,
    PostPanelComponent,
    ViewerStoriesComponent,
    StoriesUserComponent,
    ViewerUsersComponent,
    // Utility components.
    DialogComponent,
    ImgAwaitComponent,
    ModalComponent,
    RadioComponent,
    SwitchComponent,
    // Directives.
    AutoFocusDirective,
    DropdownDirective,
    InfiniteScrollDirective,
    TooltipArrayDirective,
    TooltipDirective,
    // Pipes.
    DateAgoPipe,
    EncodePipe,
    ParseUrlsPipe,
    ShortNumberPipe,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [{
    provide: APP_INITIALIZER, multi: true,
    useFactory: appInitializerFactory,
    deps: [TranslateService, Injector]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
