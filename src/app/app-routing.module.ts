import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';

const routes: Routes = [
  { path: '', component: PageFeedComponent },
  { path: ':id', component: PageUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
