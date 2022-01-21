import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  feedPosts: any[] = [];

  loadFeed(): void {
    this.http.post<object[]>('/api/feed', { session: localStorage.getItem("state") })
      .subscribe((data) => {
        console.info('Feed loaded successfully!');
        console.log(data);
        this.feedPosts = data;
      });
  }

  ngOnInit(): void {
    this.loadFeed();
  }
}
