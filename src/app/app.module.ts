import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App components.
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FeedComponent } from './components/pages/feed/feed.component';
import { LoginComponent } from './components/pages/login/login.component';
import { UserComponent } from './components/pages/user/user.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ViewerPhotoComponent } from './components/viewers/viewer-photo/viewer-photo.component';
import { ViewerMoreComponent } from './components/viewers/viewer-more/viewer-more.component';

// Utility components.
import { ImgAwaitComponent } from './utils/img-await/img-await.component';

// Pipes.
import { EncodePipe } from './pipes/encode.pipe';

@NgModule({
  declarations: [
    // App components.
    AppComponent,
    FeedComponent,
    LoginComponent,
    UserComponent,
    SidenavComponent,
    ViewerPhotoComponent,
    ViewerMoreComponent,
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
