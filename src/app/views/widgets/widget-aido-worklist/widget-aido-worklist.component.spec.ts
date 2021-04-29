import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { WidgetAidoWorklistComponent } from './widget-aido-worklist.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import { channelId } from '../../../variables/common.variable';
import {mockLocalStorage} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {WidgetAidoWorklistModule} from './widget-aido-worklist.module';
import {teleResponse} from '../../../mocks/tele-data';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';

describe('Widget Aido Worklist Component', () => {
  let component: WidgetAidoWorklistComponent;
  let fixture: ComponentFixture<WidgetAidoWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        WidgetAidoWorklistModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AidoWorklistInterceptor,
          multi: true,
        },
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
    fixture = TestBed.createComponent(WidgetAidoWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render table rows', fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const totalRow = fixture.debugElement.queryAll(By.css('.aido-appts-table tbody .aido-appt-item')).length;

    expect(totalRow).toEqual(5);
    flush();
  }));

  it('should be able to show cancel dialog', fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.aido-appts-table tbody .aido-appt-item:nth-child(2) .button-cancel')).nativeElement;
    button.click();
    fixture.detectChanges();

    expect(component.selectedCancel).toBeTruthy();
    expect(component.modalService.hasOpenModals()).toBeTruthy();

    component.modalService.dismissAll();
    flush();
  }));

  it('should be able to show verify mr dialog', fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.aido-appts-table tbody .aido-appt-item:nth-child(5) .verify-mr-button')
    ).nativeElement;
    button.click();
    fixture.detectChanges();

    expect(component.modalService.hasOpenModals()).toBeTruthy();

    component.modalService.dismissAll();
    flush();
  }));

  it(`should be able to hide cancel and reschedule if channel not IN (${channelId.MOBILE}, ${channelId.MOBILE_OTHER})`, fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const rescheduleButton = fixture.debugElement.query(
      By.css('.aido-appts-table tbody .aido-appt-item:nth-child(6) .reschedule-button')
    );
    const cancelButton = fixture.debugElement.query(
      By.css('.aido-appts-table tbody .aido-appt-item:nth-child(6) .cancel-button')
    );

    expect(rescheduleButton).toBeFalsy();
    expect(cancelButton).toBeFalsy();

    flush();
  }));

  it('should be able to show reschedule dialog', fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('.aido-appts-table tbody .aido-appt-item:nth-child(5) .reschedule-button')
    ).nativeElement;
    button.click();
    fixture.detectChanges();

    expect(component.modalService.hasOpenModals()).toBeTruthy();

    component.modalService.dismissAll();
    flush();
  }));

  it('should not be able to show rescheduling button on canceled appointment', fakeAsync(() => {
    fixture.whenStable();

    const button = fixture.debugElement.query(
      By.css('.aido-appts-table tbody .aido-appt-item:nth-child(4) .reschedule-button')
    );

    expect(button).toBeFalsy();

    flush();
  }));
});

export class AidoWorklistInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET'
        && req.urlWithParams.includes('/appointments/aido/hospital/test-hospital-id')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...teleResponse,
        },
      }));
    }
    return next.handle(req);
  }
}
