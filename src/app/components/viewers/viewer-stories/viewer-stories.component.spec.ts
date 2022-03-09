import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerStoriesComponent } from './viewer-stories.component';

describe('ViewerStoriesComponent', () => {
  let component: ViewerStoriesComponent;
  let fixture: ComponentFixture<ViewerStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerStoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
