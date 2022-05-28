import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSavedComponent } from './media-saved.component';

describe('MediaSavedComponent', () => {
  let component: MediaSavedComponent;
  let fixture: ComponentFixture<MediaSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSavedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
