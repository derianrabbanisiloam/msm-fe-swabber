import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVaccineWorklistComponent } from './page-vaccine-worklist.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {PageVaccineWorklistModule} from './page-vaccine-worklist.module';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';

export function mockLocalStorage() {
  localStorage.setItem('key', JSON.stringify({
    hospital: {
      id: 'test-hospital',
      orgId: 2,
      isBpjs: true,
    },
    user: {
      id: '234dasfawe',
      fullname: 'Test User',
      username: 'test_user',
    }
  }));
}

describe('PageVaccineWorklistComponent', () => {
  let component: PageVaccineWorklistComponent;
  let fixture: ComponentFixture<PageVaccineWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PageVaccineWorklistModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: VaccineInterceptor,
          multi: true
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVaccineWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


export class VaccineInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET' && req.urlWithParams.includes('/preregistrations/worklist/')) {
      let data = [
        {
          order_id: 'a2d951eb-98da-46ee-9617-2925dda3c842',
          registration_form_id: 'a4a61558-c483-4329-bb95-a01c167419a7',
          consent_code: 'D925FE13',
          name: 'Rezia Lukius Tejaatmaja',
          birth_date: '1998-05-11',
          phone_number_1: '081287431054',
          appointment_date: '2021-04-30',
          appointment_start_time: '10:00:00',
          appointment_end_time: '22:00:00',
          order_status: '1',
          consent_id: 380,
          participant_status: '1',
          note: null,
          form_type: 'Appointment Vaksin',
          form_type_id: 'dc1071a7-0a9a-4dd3-a8fa-62cc7299211f',
          appt_range: '10:00 - 22:00',
          screened: 'Yes',
          status: 'Not Registered',
          age: '22Y 11M 8D',
          iteration: 2,
        },
        {
          order_id: 'a2d951eb-98da-46ee-9617-2925dda3c843',
          registration_form_id: 'a4a61558-c483-4329-bb95-a01c167419a8',
          consent_code: 'D925FE20',
          name: 'Rezia Lukius Tejaatmaja Test 1',
          birth_date: '1998-05-11',
          phone_number_1: '081287431054',
          appointment_date: '2021-04-30',
          appointment_start_time: '10:00:00',
          appointment_end_time: '22:00:00',
          order_status: '1',
          consent_id: 380,
          participant_status: '1',
          note: null,
          form_type: 'Appointment Vaksin',
          form_type_id: 'dc1071a7-0a9a-4dd3-a8fa-62cc7299211f',
          appt_range: '10:00 - 22:00',
          screened: 'Yes',
          status: 'Not Registered',
          age: '22Y 11M 8D',
          iteration: 1,
        }
      ];
      if (req.urlWithParams.includes('iteration=1')) {
        data = data.filter(e => e.iteration === 1);
      } else if (req.urlWithParams.includes('iteration=2')) {
        data = data.filter(e => e.iteration === 2);
      }
      const response = {
        status: 'OK',
        message: 'Get Worklist by Hospital',
        data,
        counter: {total: 1, screened: 1, registered: 0}
      };
      return of(new HttpResponse({
        status: 200,
        body: response,
      }));
    }
    return next.handle(req);
  }

}
