import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerMoreComponent } from './viewer-more.component';

describe('ViewerMoreComponent', () => {
  let component: ViewerMoreComponent;
  let fixture: ComponentFixture<ViewerMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
