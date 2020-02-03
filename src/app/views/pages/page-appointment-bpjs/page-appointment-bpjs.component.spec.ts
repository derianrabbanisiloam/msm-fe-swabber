import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAppointmentBpjsComponent } from './page-appointment-bpjs.component';

describe('PageAppointmentBpjsComponent', () => {
  let component: PageAppointmentBpjsComponent;
  let fixture: ComponentFixture<PageAppointmentBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAppointmentBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAppointmentBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
