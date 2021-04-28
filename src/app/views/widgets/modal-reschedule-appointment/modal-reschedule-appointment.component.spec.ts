import {async, ComponentFixture, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';

import { ModalRescheduleAppointmentComponent } from './modal-reschedule-appointment.component';
import {ModalRescheduleAppointmentModule} from './modal-reschedule-appointment.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {teleResponse} from '../../../mocks/tele-data';
import {By} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';

describe('Modal Reschedule Appointment Component', () => {
  let component: ModalRescheduleAppointmentComponent;
  let fixture: ComponentFixture<ModalRescheduleAppointmentComponent>;

  describe('TELE', () => {
    beforeEach(async(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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
    }));

    beforeEach(() => {
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

    it('should be able to show doctor schedules', fakeAsync(() => {
      fixture.whenStable();
      tick(1000);
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('app-widget-doctor-schedule table tbody tr'));

      expect(rows.length).toEqual(2);

      flush();
    }));

    it(`should be able to show schedules with consultation type TELE`, fakeAsync(() => {
      fixture.whenStable();
      tick(1000);
      fixture.detectChanges();

      const contents = fixture.debugElement.queryAll(
        By.css('app-widget-doctor-schedule table tbody tr:nth-child(1) span')
      ).map(e => e.nativeElement.textContent)
        .filter(e => e !== null && e !== '' && e.match(/[0-9]/g));

      expect(contents.length).toEqual(8);
      flush();
    }));

    xit('should be able to show schedule slots by clicking a schedule', fakeAsync(() => {
      fixture.whenStable();
      tick(1000);
      fixture.detectChanges();
      const schedule = fixture.debugElement.query(
        By.css('app-widget-doctor-schedule table tbody tr:nth-child(1) td:nth-child(2) span:nth-child(2) a')
      ).nativeElement;
      schedule.click();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      discardPeriodicTasks();
      flushMicrotasks();

      flush(10000);

      const table = fixture.debugElement.query(By.css('app-widget-create-appointment table'));

      expect(table).toBeTruthy();

    }));
  });
});
