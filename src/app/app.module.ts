import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App components.
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageLoginComponent } from './components/pages/page-login/page-login.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewerPhotoComponent } from './components/viewers/viewer-photo/viewer-photo.component';
import { ViewerMoreComponent } from './components/viewers/viewer-more/viewer-more.component';
import { MediaFeedComponent } from './components/media/media-feed/media-feed.component';

// Utility components.
import { ImgAwaitComponent } from './utils/img-await/img-await.component';

// Pipes.
import { EncodePipe } from './pipes/encode.pipe';

@NgModule({
  declarations: [
    // App components.
    AppComponent,
    PageFeedComponent,
    PageLoginComponent,
    PageUserComponent,
    SidenavComponent,
    ViewerPhotoComponent,
    ViewerMoreComponent,
    MediaFeedComponent,
    // Utility components.
    ImgAwaitComponent,
    // Pipes.
    EncodePipe
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
