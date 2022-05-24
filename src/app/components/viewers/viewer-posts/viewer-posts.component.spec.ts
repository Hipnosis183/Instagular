import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPostsComponent } from './viewer-posts.component';

describe('ViewerPostsComponent', () => {
  let component: ViewerPostsComponent;
  let fixture: ComponentFixture<ViewerPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
