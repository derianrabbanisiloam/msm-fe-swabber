import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDoctorLeaveComponent } from './page-doctor-leave.component';

describe('PageDoctorLeaveComponent', () => {
  let component: PageDoctorLeaveComponent;
  let fixture: ComponentFixture<PageDoctorLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDoctorLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDoctorLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
