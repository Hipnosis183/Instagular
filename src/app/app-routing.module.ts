import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedComponent } from './components/pages/feed/feed.component';
import { UserComponent } from './components/pages/user/user.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: ':id', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
