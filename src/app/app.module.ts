import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App components.
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MediaFeedComponent } from './components/media/media-feed/media-feed.component';
import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageLoginComponent } from './components/pages/page-login/page-login.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewerPhotoComponent } from './components/viewers/viewer-photo/viewer-photo.component';
import { ViewerMoreComponent } from './components/viewers/viewer-more/viewer-more.component';
import { ViewerUsersComponent } from './components/viewers/viewer-users/viewer-users.component';

// Utility components.
import { ImgAwaitComponent } from './utils/img-await/img-await.component';
import { SearchComponent } from './utils/search/search.component';

// Directives.
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';

// Pipes.
import { EncodePipe } from './pipes/encode.pipe';
import { ParseUrlsPipe } from './pipes/parse-urls.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';

@NgModule({
  declarations: [
    // App components.
    AppComponent,
    MediaFeedComponent,
    PageFeedComponent,
    PageLoginComponent,
    PageUserComponent,
    SidenavComponent,
    ViewerPhotoComponent,
    ViewerMoreComponent,
    ViewerUsersComponent,
    // Utility components.
    ImgAwaitComponent,
    SearchComponent,
    // Directives.
    InfiniteScrollDirective,
    // Pipes.
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
