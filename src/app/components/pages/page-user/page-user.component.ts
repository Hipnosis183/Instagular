import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HighlightsService } from 'src/app/services/highlights.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})

export class PageUserComponent {

  constructor(
    private highlights: HighlightsService,
    private route: ActivatedRoute,
    private title: Title,
    private translate: TranslateService,
    private user: UserService,
  ) { }

  userProfile: any = null;
  userStories: any[] = [];
  userNotFound: boolean = false;

  async loadProfile(): Promise<void> {
    try {
      await this.user.profile(this.route.snapshot.paramMap.get('id')).then((data) => {
        this.userProfile = data;
        this.title.setTitle(`${data.full_name ? data.full_name : data.username} (@${data.username})`);
      });
    } catch {
      this.title.setTitle(this.translate.instant('PAGE_USER.NOT_FOUND_TITLE'));
      this.userNotFound = true;
    }
  }

  async loadStories(): Promise<void> {
    if (!this.userNotFound) {
      await this.highlights.tray(this.userProfile.pk).then((data) => {
        this.userStories = this.userStories.concat(data);
      });
    }
  }

  async ngOnInit(): Promise<void> {
    localStorage.removeItem('feed');
    localStorage.removeItem('reels');
    localStorage.removeItem('video');
    localStorage.removeItem('tagged');
    localStorage.removeItem('collection');
    localStorage.removeItem('followers');
    localStorage.removeItem('following');
    await this.loadProfile();
    await this.loadStories();
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.translate.instant('GENERAL.INSTAGULAR'));
  }
}
