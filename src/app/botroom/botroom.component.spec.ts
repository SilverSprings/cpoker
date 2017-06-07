import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotroomComponent } from './botroom.component';

describe('BotroomComponent', () => {
  let component: BotroomComponent;
  let fixture: ComponentFixture<BotroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
