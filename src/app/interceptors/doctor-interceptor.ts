import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {doctorHospital, doctorHospitalConsultation, doctorLeaves, doctorResponses, doctorSchedules} from '../mocks/doctors';
import {doctorScheduleSlots} from '../mocks/doctor-schedule-slots';

export class DoctorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET' && req.urlWithParams.includes('/api/v2/doctors/lite')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...doctorResponses,
        }
      }));
    }
    if (req.method === 'GET'
      && req.urlWithParams.includes('schedules?doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4')) {
      const params = new URLSearchParams(req.urlWithParams);
      const consultationIds = params.get('consultationTypeId').split(':');
      return of(new HttpResponse({
        status: 200,
        body: {
          status: doctorSchedules.status,
          message: doctorSchedules.message,
          data: [
            {
              ...doctorSchedules.data[0],
              schedules: doctorSchedules.data[0].schedules
                .filter(i => consultationIds.includes(i.consultation_type_id)),
            }
          ],
        }
      }));
    }
    if (req.method === 'GET'
      && req.urlWithParams.includes('/doctors/leaves?&year=2021&doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...doctorLeaves,
        }
      }));
    }
    if (req.method === 'GET'
      && req.urlWithParams
        .includes('/schedules/time-slot/hospital/test-hospital-id/doctor/9518afa5-7fd9-4b5b-843f-fad9a6339cf4')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...doctorScheduleSlots,
        }
      }));
    }
    if (req.method === 'GET'
      && req.urlWithParams
        .includes('/schedules/doctor-hospital-consultation?doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4&hospitalId=test-hospital-id')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...doctorHospitalConsultation,
        }
      }));
    }

    if (req.method === 'GET'
      && req.urlWithParams
        .includes('/doctors/hospital/test-hospital-id?doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4&hospitalId=test-hospital-id')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...doctorHospital
        }
      }));
    }

    if (req.method === 'GET'
      && (req.urlWithParams.includes('/doctors/notes')
        || req.urlWithParams.includes('/schedules/block')
        || req.urlWithParams.includes('/generals/specialities?total=all')
        || req.urlWithParams.includes('/generals/payers/hospital/2')
        || req.urlWithParams.includes('/generals/procedure-room/2')
        || req.urlWithParams.includes('/appointments?hospitalId=test-hospital-id&doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4'))) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          message: 'success',
          data: []
        }
      }));
    }
    if (req.method === 'GET' && req.urlWithParams.includes('/generals/patienttype')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          data: [{value: '3', description: 'EMPLOYEE'}, {value: '5', description: 'KITAS'}, {
            value: '4',
            description: 'PASSPORT'
          }, {value: '2', description: 'PAYER'}, {value: '1', description: 'PRIVATE'}],
          message: 'Successfully get general'
        }
      }));
    }

    if (req.method === 'GET' && req.urlWithParams.includes('/generals/admission-type')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          data: [{value: '3', description: 'EMERGENCY'}, {value: '4', description: 'HEALTH CHECKUP'}, {
            value: '2',
            description: 'INPATIENT'
          }, {value: '1', description: 'OUTPATIENT'}],
          message: 'Successfully get general'
        }
      }));
    }
    if (req.method === 'GET' && req.urlWithParams.includes('/generals/referral-type')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          data: [{value: '3', description: 'External'}, {value: '5', description: 'ExternalOrganization'}, {
            value: '6',
            description: 'ExternalOrganizationUnlisted'
          }, {value: '4', description: 'ExternalUnlisted'}, {value: '2', description: 'Internal'}, {
            value: '1',
            description: 'Self'
          }],
          message: 'Successfully get general'
        }
      }));
    }
    console.log(req.urlWithParams);
    return next.handle(req);
  }

}
