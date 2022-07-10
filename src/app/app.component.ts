import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  loadSession = false;

  ngOnInit(): void {
    this.loadSession = (localStorage.getItem('state') != null) ? true : false;
  }
}
