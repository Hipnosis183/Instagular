import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageFeedComponent } from './components/pages/page-feed/page-feed.component';
import { PageUserComponent } from './components/pages/page-user/page-user.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', component: PageFeedComponent },
  { path: 'settings', component: SettingsComponent },
  { path: ':id', component: PageUserComponent },
  { path: ':id/:tab', component: PageUserComponent },
  { path: ':id/:tab/:c_name', component: PageUserComponent },
  { path: ':id/:tab/:c_name/:c_id', component: PageUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
