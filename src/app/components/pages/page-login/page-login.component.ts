import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})

export class PageLoginComponent {

  constructor(
    private account: AccountService,
    private formBuilder: FormBuilder,
  ) { }

  loginForm = this.formBuilder.group({ username: '', password: '' });

  loginUser(): void {
    this.account.login(this.loginForm.value);
  }
}
