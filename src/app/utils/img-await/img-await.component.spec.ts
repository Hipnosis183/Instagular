import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgAwaitComponent } from './img-await.component';

describe('ImgAwaitComponent', () => {
  let component: ImgAwaitComponent;
  let fixture: ComponentFixture<ImgAwaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgAwaitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgAwaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
