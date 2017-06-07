import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityroomComponent } from './cityroom.component';

describe('CityroomComponent', () => {
  let component: CityroomComponent;
  let fixture: ComponentFixture<CityroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
