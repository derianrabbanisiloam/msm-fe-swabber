import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDoctorScheduleComponent } from './page-doctor-schedule.component';

describe('PageDoctorScheduleComponent', () => {
  let component: PageDoctorScheduleComponent;
  let fixture: ComponentFixture<PageDoctorScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDoctorScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
