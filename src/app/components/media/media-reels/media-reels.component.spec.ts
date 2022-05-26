import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaReelsComponent } from './media-reels.component';

describe('MediaReelsComponent', () => {
  let component: MediaReelsComponent;
  let fixture: ComponentFixture<MediaReelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaReelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaReelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
