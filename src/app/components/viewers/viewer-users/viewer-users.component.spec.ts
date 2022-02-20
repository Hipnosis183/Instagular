import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerUsersComponent } from './viewer-users.component';

describe('ViewerUsersComponent', () => {
  let component: ViewerUsersComponent;
  let fixture: ComponentFixture<ViewerUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
