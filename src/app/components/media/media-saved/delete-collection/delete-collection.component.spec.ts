import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCollectionComponent } from './delete-collection.component';

describe('DeleteCollectionComponent', () => {
  let component: DeleteCollectionComponent;
  let fixture: ComponentFixture<DeleteCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
