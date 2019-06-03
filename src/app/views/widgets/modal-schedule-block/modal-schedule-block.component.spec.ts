import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScheduleBlockComponent } from './modal-schedule-block.component';

describe('ModalScheduleBlockComponent', () => {
  let component: ModalScheduleBlockComponent;
  let fixture: ComponentFixture<ModalScheduleBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalScheduleBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScheduleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
