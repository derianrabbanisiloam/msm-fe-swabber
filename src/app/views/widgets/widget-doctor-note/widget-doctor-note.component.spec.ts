import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDoctorNoteComponent } from './widget-doctor-note.component';

describe('WidgetDoctorNoteComponent', () => {
  let component: WidgetDoctorNoteComponent;
  let fixture: ComponentFixture<WidgetDoctorNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDoctorNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDoctorNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
