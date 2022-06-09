import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App components.
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MediaFeedComponent } from './components/media/media-feed/media-feed.component';
import { MediaReelsComponent } from './components/media/media-reels/media-reels.component';
import { MediaSavedComponent } from './components/media/media-saved/media-saved.component';
import { CreateCollectionComponent } from './components/media/media-saved/create-collection/create-collection.component';
import { EditCollectionComponent } from './components/media/media-saved/edit-collection/edit-collection.component';
import { DeleteCollectionComponent } from './components/media/media-saved/delete-collection/delete-collection.component';
import { MediaStoriesComponent } from './components/media/media-stories/media-stories.component';
import { MediaVideoComponent } from './components/media/media-video/media-video.component';
import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageLoginComponent } from './components/pages/page-login/page-login.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewerPostsComponent } from './components/viewers/viewer-posts/viewer-posts.component';
import { ViewerStoriesComponent } from './components/viewers/viewer-stories/viewer-stories.component';
import { ViewerUsersComponent } from './components/viewers/viewer-users/viewer-users.component';

// Utility components.
import { ImgAwaitComponent } from './utils/img-await/img-await.component';
import { SearchComponent } from './utils/search/search.component';

// Directives.
import { DropdownDirective } from './directives/dropdown.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import { TooltipArrayDirective } from './directives/tooltip-array.directive';
import { TooltipDirective } from './directives/tooltip.directive';

// Pipes.
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { EncodePipe } from './pipes/encode.pipe';
import { ParseUrlsPipe } from './pipes/parse-urls.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';

@NgModule({
  declarations: [
    // App components.
    AppComponent,
    MediaFeedComponent,
    MediaReelsComponent,
    MediaSavedComponent,
    CreateCollectionComponent,
    EditCollectionComponent,
    DeleteCollectionComponent,
    MediaStoriesComponent,
    MediaVideoComponent,
    PageFeedComponent,
    PageLoginComponent,
    PageUserComponent,
    SidenavComponent,
    ViewerPostsComponent,
    ViewerStoriesComponent,
    ViewerUsersComponent,
    // Utility components.
    ImgAwaitComponent,
    SearchComponent,
    // Directives.
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
