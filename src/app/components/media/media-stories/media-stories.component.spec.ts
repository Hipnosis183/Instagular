import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaStoriesComponent } from './media-stories.component';

describe('MediaStoriesComponent', () => {
  let component: MediaStoriesComponent;
  let fixture: ComponentFixture<MediaStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaStoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
