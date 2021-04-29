import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCreateAppointmentComponent } from './widget-create-appointment.component';
import {WidgetCreateAppointmentModule} from './widget-create-appointment.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('WidgetCreateAppointmentComponent', () => {
  let component: WidgetCreateAppointmentComponent;
  let fixture: ComponentFixture<WidgetCreateAppointmentComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        WidgetCreateAppointmentModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DoctorInterceptor,
          multi: true,
        },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                doctorId: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
                date: '2021-04-27'
              })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCreateAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render tele rows with checkin button', (done) => {
    fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('.tele-body tr:nth-child(1) .checkin-button'));

      expect(button).toBeTruthy();
      done();
    }, 200);
  });

  it('should not be able to render tele rows with checkin button on rescheduling tele', (done) => {
    component.hideTeleActionOnRescheduling = true;
    fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      const body = fixture.debugElement.query(By.css('.tele-body'));
      const button = fixture.debugElement.query(By.css('.tele-body tr:nth-child(1) .checkin-button'));

      expect(body).toBeTruthy();
      expect(button).toBeFalsy();
      done();
    }, 200);
  });
});
