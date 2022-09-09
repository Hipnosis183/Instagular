import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HighlightsService } from 'src/app/services/highlights.service';
import { StoreService } from 'src/app/services/store.service';
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
    public store: StoreService,
    private title: Title,
    private translate: TranslateService,
    private user: UserService,
  ) { }

  userStories: any[] = [];
  userNotFound: boolean = false;

  async loadProfile(): Promise<void> {
    try {
      await this.user.profile(this.route.snapshot.paramMap.get('id')).then((data) => {
        this.store.state.userPage = data;
        this.title.setTitle(`${data.full_name ? data.full_name : data.username} (@${data.username})`);
      });
    } catch {
      this.title.setTitle(this.translate.instant('PAGE_USER.NOT_FOUND_TITLE'));
      this.userNotFound = true;
    }
  }

  async loadStories(): Promise<void> {
    if (!this.userNotFound && this.store.state.userPage.has_highlight_reels) {
      await this.highlights.tray(this.store.state.userPage.pk).then((data) => {
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
    localStorage.removeItem('mutuals');
    localStorage.removeItem('followers');
    localStorage.removeItem('following');
    this.store.state.userPage = null;
    await this.loadProfile();
    await this.loadStories();
  }

  ngOnDestroy(): void {
    this.store.state.userPage = null;
    this.title.setTitle(this.translate.instant('GENERAL.INSTAGULAR'));
  }
}
