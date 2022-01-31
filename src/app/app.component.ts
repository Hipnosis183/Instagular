import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  loadSession = false;

  ngOnInit(): void {
    if (localStorage.getItem("state") != null) {
      console.info('Session found!');
      this.loadSession = true;
    } else {
      console.info('Session not found.');
      this.loadSession = false;
    }
  }
}
