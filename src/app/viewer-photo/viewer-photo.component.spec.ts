import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPhotoComponent } from './viewer-photo.component';

describe('ViewerPhotoComponent', () => {
  let component: ViewerPhotoComponent;
  let fixture: ComponentFixture<ViewerPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
