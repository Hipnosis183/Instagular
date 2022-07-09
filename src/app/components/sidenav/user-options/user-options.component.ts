import { Component, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css']
})

export class UserOptionsComponent {

  constructor(private account: AccountService) { }

  @Input() userProfile: any;
  @Input() expandedSidenav: boolean = true;

  logoutUser(): void {
    this.account.logout();
  }
}
