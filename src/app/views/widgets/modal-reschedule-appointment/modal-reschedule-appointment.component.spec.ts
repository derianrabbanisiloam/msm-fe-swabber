import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {ModalRescheduleAppointmentComponent} from './modal-reschedule-appointment.component';
import {ModalRescheduleAppointmentModule} from './modal-reschedule-appointment.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {teleResponse} from '../../../mocks/tele-data';
import {By} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';
import * as moment from 'moment';
import {channelId} from '../../../variables/common.variable';
import {of} from 'rxjs';

describe('Modal Reschedule Appointment Component', () => {
  let component: ModalRescheduleAppointmentComponent;
  let fixture: ComponentFixture<ModalRescheduleAppointmentComponent>;

  function compileComponent() {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ModalRescheduleAppointmentModule,
      ],
      providers: [
        NgbActiveModal,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DoctorInterceptor,
          multi: true,
        },
      ]
    })
      .compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(ModalRescheduleAppointmentComponent);
    component = fixture.componentInstance;
    component.teleAppointmentData = {
      isTele: true,
      appointment: {
        ...teleResponse.data[0],
      }
    };
    spyOn(component, 'searchSchedule1').and.callThrough();
    fixture.detectChanges();
  }

  describe('TELE Render', () => {
    beforeEach(async(() => {
      compileComponent();
    }));

    beforeEach(() => {
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be able to set selected doctor and only has one item', fakeAsync(() => {
      fixture.whenStable();
      tick(1000);
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('#doctor option'));

      expect(options.length).toEqual(1);
      expect(component.searchSchedule1).toHaveBeenCalled();

      flush();
    }));

    it('should be able to show doctor schedules', async (done) => {
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('app-widget-doctor-schedule table tbody tr'));

        expect(rows.length).toEqual(2);

        done();
      }, 300);
    });

    it(`should be able to show schedules with consultation type TELE`, (done) => {
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();

        const contents = fixture.debugElement.queryAll(
          By.css('app-widget-doctor-schedule table tbody tr:nth-child(1) span')
        ).map(e => e.nativeElement.textContent)
          .filter(e => e !== null && e !== '' && e.match(/[0-9]/g));

        expect(contents.length).toEqual(8);

        done();
      }, 300);
    });
  });

  /** normal test with fakeAsync is hard in here, using setTimeout does the job */
  describe('TELE Rescheduling', () => {
    beforeAll(async(() => {
      jasmine.clock().mockDate(moment('2021-04-27').toDate());
    }));

    beforeEach(async(() => {
      compileComponent();
    }));

    beforeEach(() => {
      createComponent();
    });

    function clickTeleSchedule(tdIndex: number, timeIndex: number) {
      const schedule = fixture.debugElement.query(
        By.css(`app-widget-doctor-schedule table tbody tr:nth-child(1) td:nth-child(${tdIndex}) span:nth-child(${timeIndex}) a`)
      ).nativeElement;
      schedule.click();
    }

    it('should be able to show schedule slots by clicking a schedule', (done) => {
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();
        clickTeleSchedule(2, 2);
        fixture.detectChanges();
        setTimeout(() => {
          fixture.detectChanges();
          const table = fixture.debugElement.query(By.css('app-widget-create-appointment .tele-body'));

          expect(table).toBeTruthy();
          done();
        }, 300);
      }, 300);
    });

    it('should be able to reschedule by choosing new slot', (done) => {
      spyOn(component.appointmentService, 'rescheduleApptTele').and.returnValue(of({
        status: 'OK',
        message: 'success',
        data: {},
      }));
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();
        clickTeleSchedule(2, 2);
        fixture.detectChanges();

        setTimeout(() => {
          fixture.detectChanges();
          const availableButton = fixture.debugElement.query(
            By.css('app-widget-create-appointment .tele-body tr:nth-child(3) td:nth-child(3) a')
          ).nativeElement;
          availableButton.click();
          fixture.detectChanges();

          setTimeout(() => {
            const saveButton = fixture.debugElement.query(
              By.css('.save-close-button')
            ).nativeElement;
            saveButton.click();
            fixture.detectChanges();

            expect(component.appointmentService.rescheduleApptTele).toHaveBeenCalledWith({
              appointmentId: 'dec25b90-8332-4f6c-93ad-cd1527d80e52',
              appointmentDate: '2021-04-27',
              appointmentFromTime: '16:30',
              appointmentToTime: '16:45',
              scheduleId: 'bf7eab78-2fd6-4c67-bdbf-034b18fd5f05',
              channelId: channelId.MOBILE,
              userName: 'Test User',
              userId: '234dasfawe',
              source: 'FrontOffice'
            });

            done();
          }, 100);
        }, 300);
      }, 300);
    });

    it('should be able to reschedule to the future schedule', (done) => {
      spyOn(component.appointmentService, 'rescheduleApptTele').and.returnValue(of({
        status: 'OK',
        message: 'success',
        data: {},
      }));
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();
        clickTeleSchedule(4, 1);
        fixture.detectChanges();

        setTimeout(() => {
          fixture.detectChanges();
          const availableButton = fixture.debugElement.query(
            By.css('app-widget-create-appointment .tele-body tr:nth-child(3) td:nth-child(3) a')
          ).nativeElement;
          availableButton.click();
          fixture.detectChanges();

          setTimeout(() => {
            const saveButton = fixture.debugElement.query(
              By.css('.save-close-button')
            ).nativeElement;
            saveButton.click();
            fixture.detectChanges();

            expect(component.appointmentService.rescheduleApptTele).toHaveBeenCalledWith({
              appointmentId: 'dec25b90-8332-4f6c-93ad-cd1527d80e52',
              appointmentDate: '2021-04-29',
              appointmentFromTime: '16:30',
              appointmentToTime: '16:45',
              scheduleId: 'bf7eab78-2fd6-4c67-bdbf-034b18fd5f05',
              channelId: channelId.MOBILE,
              userName: 'Test User',
              userId: '234dasfawe',
              source: 'FrontOffice'
            });

            done();
          }, 100);
        }, 300);
      }, 300);
    });

    it('should not be able to reschedule to the future if not tele rescheduling mode', (done) => {
      spyOn(component.appointmentService, 'rescheduleApptTele').and.returnValue(of({
        status: 'OK',
        message: 'success',
        data: {},
      }));
      fixture.whenStable();
      setTimeout(() => {
        fixture.detectChanges();
        clickTeleSchedule(4, 1);
        fixture.detectChanges();
        component.createAppointmentView.hideTeleActionOnRescheduling = false;

        setTimeout(() => {
          fixture.detectChanges();
          const availableButton = fixture.debugElement.query(
            By.css('app-widget-create-appointment .tele-body tr:nth-child(3) td:nth-child(3) a')
          );

          expect(availableButton).toBeFalsy();

          done();
        }, 300);
      }, 300);
    });
  });
});
