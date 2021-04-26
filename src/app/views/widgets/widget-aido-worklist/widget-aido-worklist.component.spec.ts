import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { WidgetAidoWorklistComponent } from './widget-aido-worklist.component';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {NgbAlertModule, NgbModalModule, NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {appointmentStatusId} from '../../../variables/common.variable';

describe('WidgetAidoWorklistComponent', () => {
  let component: WidgetAidoWorklistComponent;
  let fixture: ComponentFixture<WidgetAidoWorklistComponent>;

  beforeEach(async(() => {
    localStorage.setItem('key', JSON.stringify({
      hospital: {
        id: 'test-hospital-id',
      }
    }));
    TestBed.configureTestingModule({
      declarations: [ WidgetAidoWorklistComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MyDateRangePickerModule,
        FormsModule,
        NgbAlertModule,
        NguiAutoCompleteModule,
        AutocompleteLibModule,
        NgbPopoverModule,
        NgbProgressbarModule,
        NgbModalModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AidoWorklistInterceptor,
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

    expect(totalRow).toEqual(3);
    flush();
  }));

  it('should be able to show cancel dialog', fakeAsync(() => {
    fixture.whenStable();
    tick(1000);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.aido-appts-table tbody .aido-appt-item:nth-child(2) .button-cancel')).nativeElement;
    button.click();
    fixture.detectChanges();

    expect(component.modalService.hasOpenModals()).toBeTruthy();

    component.modalService.dismissAll();
    flush();
  }));
});


export class AidoWorklistInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET'
        && req.urlWithParams.includes('/appointments/aido/hospital/test-hospital-id')) {
      const data = {
        data: [
          {
            contact_name: 'Rezia Lukius Tejaatmaja',
            date_of_birth: '1998-05-11',
            doctor_name: 'Prof. DR. dr. Eka J. Wahjoepramono, SpBS',
            organization_id: 2,
            appointment_id: 'dec25b90-8332-4f6c-93ad-cd1527d80e52',
            appointment_date: '2021-04-23',
            hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
            doctor_id: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
            appointment_from_time: '20:00:00',
            appointment_to_time: '20:15:00',
            contact_id: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            email_address: 'r.lukius@gmail.com',
            phone_number: '81287431054',
            delivery_address: 'Karawaci, KARAWACI, KARAWACI, TANGERANG, KOTA, BANTEN. 15811',
            appointment_status_id: '1',
            admission_status_id: '1',
            channel_id: '5',
            is_double_mr: false,
            patient_hope_id: 2000001998612,
            patient_organization_id: 2000000112103,
            doctor_hope_id: 2000000732,
            chief_complaint: 'dev tes 1',
            zoom_url: null,
            aido_transaction_id: null,
            created_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            created_date: '2021-04-23T04:57:21.761Z',
            created_from: 'iOS',
            created_name: 'Tele MySiloam',
            modified_by: 'Albert Agung Daru Aswindra',
            modified_date: '2021-04-23T05:04:53.379Z',
            modified_from: 'FrontOffice',
            modified_name: 'Albert Agung Daru Aswindra',
            payer_id: 2000000002301,
            payer_eligibility: null,
            payer_number: null,
            is_excess: false,
            is_sms_sent: false,
            is_rescheduled: false,
            payment_status_id: '1',
            schedule_id: '3962e180-764b-4409-a9d8-ecc42d010557',
            appointment_no: 0,
            medical_record_number: 858103,
            eligible_status_id: '3',
            excess_amount: 0,
            identity_card_file: 'tele_identity_card-16191538298868323.jpg',
            employee_card_file: null,
            insurance_card_file: null,
            identity_number: null,
            city: 'Tangerang',
            province: 'Banten',
            delivery_notes: 'Tes Delivery Imperial Karawaci',
            delivery_phone: '081287431054',
            longitude: '-6.232560320096738',
            latitude: '106.60621159940209'
          },
          {
            contact_name: 'Rezia Lukius Tejaatmaja',
            date_of_birth: '1998-05-11',
            doctor_name: 'Prof. DR. dr. Eka J. Wahjoepramono, SpBS',
            organization_id: 2,
            appointment_id: '255ad6e8-434e-4477-9721-bfeb31aa9d0d',
            appointment_date: '2021-04-23',
            hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
            doctor_id: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
            appointment_from_time: '22:00:00',
            appointment_to_time: '22:15:00',
            contact_id: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            email_address: 'r.lukius@gmail.com',
            phone_number: '81287431054',
            delivery_address: 'Karawaci, KARAWACI, KARAWACI, TANGERANG, KOTA, BANTEN. 15811',
            appointment_status_id: '1',
            admission_status_id: '2',
            channel_id: '5',
            is_double_mr: false,
            patient_hope_id: 2000001998612,
            patient_organization_id: 2000000112103,
            doctor_hope_id: 2000000732,
            chief_complaint: 'dev tes 2',
            zoom_url: null,
            aido_transaction_id: null,
            created_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            created_date: '2021-04-23T05:00:46.683Z',
            created_from: 'iOS',
            created_name: 'Tele MySiloam',
            modified_by: 'Albert Agung Daru Aswindra',
            modified_date: '2021-04-23T05:04:56.622Z',
            modified_from: 'FrontOffice',
            modified_name: 'Albert Agung Daru Aswindra',
            payer_id: 2000000002301,
            payer_eligibility: null,
            payer_number: null,
            is_excess: false,
            is_sms_sent: false,
            is_rescheduled: false,
            payment_status_id: '1',
            schedule_id: '3962e180-764b-4409-a9d8-ecc42d010557',
            appointment_no: 8,
            medical_record_number: 858103,
            eligible_status_id: '3',
            excess_amount: 0,
            identity_card_file: 'tele_identity_card-16191540379387874.jpg',
            employee_card_file: null,
            insurance_card_file: null,
            identity_number: null,
            city: 'Tangerang',
            province: 'Banten',
            delivery_notes: 'Tes Delivery Asal',
            delivery_phone: '081287431054',
            longitude: '-6.1754',
            latitude: '106.8272'
          },
          {
            contact_name: 'Rezia Lukius Tejaatmaja Test Canceled',
            date_of_birth: '1998-05-11',
            doctor_name: 'Prof. DR. dr. Eka J. Wahjoepramono, SpBS',
            organization_id: 2,
            appointment_id: '255ad6e8-434e-4477-9721-bfeb31aa9d10',
            appointment_date: '2021-04-23',
            hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
            doctor_id: '9518afa5-7fd9-4b5b-843f-fad9a6339cf4',
            appointment_from_time: '22:00:00',
            appointment_to_time: '22:15:00',
            contact_id: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            email_address: 'r.lukius@gmail.com',
            phone_number: '81287431054',
            delivery_address: 'Karawaci, KARAWACI, KARAWACI, TANGERANG, KOTA, BANTEN. 15811',
            appointment_status_id: appointmentStatusId.INACTIVE,
            admission_status_id: '2',
            channel_id: '5',
            is_double_mr: false,
            patient_hope_id: 2000001998612,
            patient_organization_id: 2000000112103,
            doctor_hope_id: 2000000732,
            chief_complaint: 'dev tes 2',
            zoom_url: null,
            aido_transaction_id: null,
            created_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
            created_date: '2021-04-23T05:00:46.683Z',
            created_from: 'iOS',
            created_name: 'Tele MySiloam',
            modified_by: 'Albert Agung Daru Aswindra',
            modified_date: '2021-04-23T05:04:56.622Z',
            modified_from: 'FrontOffice',
            modified_name: 'Albert Agung Daru Aswindra',
            payer_id: 2000000002301,
            payer_eligibility: null,
            payer_number: null,
            is_excess: false,
            is_sms_sent: false,
            is_rescheduled: false,
            payment_status_id: '1',
            schedule_id: '3962e180-764b-4409-a9d8-ecc42d010557',
            appointment_no: 8,
            medical_record_number: 858103,
            eligible_status_id: '3',
            excess_amount: 0,
            identity_card_file: 'tele_identity_card-16191540379387874.jpg',
            employee_card_file: null,
            insurance_card_file: null,
            identity_number: null,
            city: 'Tangerang',
            province: 'Banten',
            delivery_notes: 'Tes Delivery Asal',
            delivery_phone: '081287431054',
            longitude: '-6.1754',
            latitude: '106.8272'
          }
        ],
        status: 'OK',
        message: 'Get appointment list AIDO successfully'
      };
      return of(new HttpResponse({
        status: 200,
        body: data,
      }));
    }
    return next.handle(req);
  }
}
