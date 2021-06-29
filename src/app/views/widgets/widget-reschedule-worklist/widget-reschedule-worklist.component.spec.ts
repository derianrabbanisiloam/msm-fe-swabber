import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import {WidgetRescheduleWorklistComponent} from './widget-reschedule-worklist.component';
import {WidgetRescheduleWorlistModule} from './widget-reschedule-worlist.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RescheduleWorklistInterceptor} from '../../../interceptors/reschedule-worklist-interceptor';
import {clickElement, getElementBy, getTextContent, getTextContents, getTotalElementsBy} from '../widget-base/widget-base-test.util';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';

describe('WidgetRescheduleWorklistComponent', () => {
  let component: WidgetRescheduleWorklistComponent;
  let fixture: ComponentFixture<WidgetRescheduleWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        WidgetRescheduleWorlistModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RescheduleWorklistInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DoctorInterceptor,
          multi: true,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRescheduleWorklistComponent);
    component = fixture.componentInstance;
    spyOn(component, 'countRecheduleBpjs').and.stub();
    spyOn(component, 'countRecheduleNonBpjs').and.stub();
    spyOn(component, 'getDoctors').and.stub();
    spyOn(component, 'getRescheduleWorklist').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AIDO', () => {
    it('should be able to show total reschedule', fakeAsync(() => {
      fixture.whenStable();
      const totalCount = getTextContent(fixture, '.tele-count-button > .roundNumber');

      expect(totalCount).toEqual('10');
      flush();
    }));

    it('should be able to show reschedule items', fakeAsync(() => {
      fixture.whenStable();

      clickElement(fixture, '.tele-count-button');

      const totalItems = getTotalElementsBy(fixture, '.tele-table tbody .tele-item');

      expect(totalItems).toEqual(5);
      flush();
    }));

    it('should be able to show .reschedule-button if channel MOBILE or MOBILE_OTHER, and INACTIVE and not eligible', fakeAsync(() => {
      fixture.whenStable();

      clickElement(fixture, '.tele-count-button');

      const rescheduleButton = getElementBy(fixture, '.tele-table tbody .tele-item:nth-child(2) .reschedule-button');

      expect(rescheduleButton).toBeTruthy();
      flush();
    }));

    it('should not be able to show .reschedule-button ' +
      'if not (channel MOBILE or MOBILE_OTHER, and INACTIVE and not eligible)', fakeAsync(() => {
      fixture.whenStable();

      clickElement(fixture, '.tele-count-button');

      const rescheduleButton = getElementBy(fixture, '.tele-table tbody .tele-item:nth-child(4) .reschedule-button');

      expect(rescheduleButton).toBeFalsy();
      flush();
    }));

    it('should be able to open Reschedule Modal', fakeAsync(() => {
      fixture.whenStable();

      clickElement(fixture, '.tele-count-button');

      clickElement(fixture, '.tele-table tbody .tele-item:nth-child(2) .reschedule-button');

      expect(component.modalService.hasOpenModals);

      component.modalService.dismissAll();
      flush();
    }));

    it('should be able to validate reschedule item', fakeAsync(() => {
      fixture.whenStable();

      clickElement(fixture, '.tele-count-button');

      const contents = getTextContents(fixture, '.tele-table tbody .tele-item:nth-child(2) td');

      expect(contents).toEqual([
        'Rezia Lukius Tejaatmaja',
        '11-05-1998',
        'NO',
        '621287431054',
        '1600 Amphi...',
        '24-06-2021',
        '11:00 - 11:15',
        'Prof. DR. dr. Eka J. Wahjoepra...',
        '',
        'Not Processed',
        '',
        'Verified',
        'ef91ac82-350a-4...',
        'Reschedule'
      ]);
      flush();
    }));
  });
});
