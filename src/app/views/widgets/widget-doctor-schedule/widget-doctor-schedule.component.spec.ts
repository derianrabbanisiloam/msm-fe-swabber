import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import { WidgetDoctorScheduleComponent } from './widget-doctor-schedule.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {WidgetDoctorScheduleModule} from './widget-doctor-schedule.module';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

describe('WidgetDoctorScheduleComponent', () => {
  let component: WidgetDoctorScheduleComponent;
  let fixture: ComponentFixture<WidgetDoctorScheduleComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        WidgetDoctorScheduleModule
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
              queryParam: {
                doctor_id: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
                doctor_name: 'test doctor name'
              },
              queryParamMap: convertToParamMap({
                doctor_id: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
                doctor_name: 'test doctor name'
              })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to show .schedule-type-option', fakeAsync(() => {
    fixture.whenStable();

    const select = fixture.debugElement.query(By.css('.schedule-type-option'));

    expect(select).toBeTruthy();

    flush();
  }));

  it('should be able to hide .schedule-type-option for TELE', fakeAsync(() => {
    fixture.whenStable();
    component.hideScheduleTypeOptionOnTele = true;
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('.schedule-type-option'));

    expect(select).toBeFalsy();

    flush();
  }));
});
