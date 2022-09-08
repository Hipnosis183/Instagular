import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent {

  constructor(
    public router: Router,
    public store: StoreService,
    private user: UserService,
  ) { }

  expandedSidenav: boolean = true;

  expandSidenav(): void {
    this.expandedSidenav = !this.expandedSidenav;
    this.store.state.expandedSidenav = this.expandedSidenav;
    localStorage.setItem('expanded', this.expandedSidenav.toString());
  }

  loadSidenav(): void {
    if (localStorage.getItem('expanded')) {
      let expanded: any = localStorage.getItem('expanded');
      this.expandedSidenav = JSON.parse(expanded);
    }
  }

  userProfile: any = null;

  loadProfile(): void {
    this.user.profile().then((data: any) => {
      this.userProfile = data;
      localStorage.setItem('user', JSON.stringify(data));
      this.store.loadSaved();
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSidenav();
  }
}
