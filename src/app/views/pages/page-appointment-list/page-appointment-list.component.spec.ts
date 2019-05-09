import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAppointmentListComponent } from './page-appointment-list.component';

describe('PageAppointmentListComponent', () => {
  let component: PageAppointmentListComponent;
  let fixture: ComponentFixture<PageAppointmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAppointmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
