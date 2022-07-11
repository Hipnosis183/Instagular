import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

  constructor(
    private store: StoreService,
    private translate: TranslateService,
  ) { }

  languageSelect(code: string): void {
    this.translate.use(code).subscribe(() => {
      localStorage.setItem('language', code);
      this.store.state.languageUpdated = false;
      setTimeout(() => { this.store.state.languageUpdated = true; });
    });
  }
}
