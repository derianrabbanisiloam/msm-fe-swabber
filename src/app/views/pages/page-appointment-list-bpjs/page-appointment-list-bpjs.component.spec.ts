import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAppointmentListBpjsComponent } from './page-appointment-list-bpjs.component';

describe('PageAppointmentListBpjsComponent', () => {
  let component: PageAppointmentListBpjsComponent;
  let fixture: ComponentFixture<PageAppointmentListBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAppointmentListBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAppointmentListBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
