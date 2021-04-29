import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {doctorHospital, doctorHospitalConsultation, doctorLeaves, doctorResponses, doctorSchedules} from '../mocks/doctors';
import {doctorScheduleSlots} from '../mocks/doctor-schedule-slots';
import {channelId, paymentStatus} from '../variables/common.variable';

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
        || req.urlWithParams.includes('/generals/procedure-room/2'))) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          message: 'success',
          data: []
        }
      }));
    }
    if (req.method === 'GET'
      && req.urlWithParams.includes('/appointments?hospitalId=test-hospital-id&doctorId=9518afa5-7fd9-4b5b-843f-fad9a6339cf4')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          data: [
            {
              appointment_id: '6b91847a-de1a-405e-9aa3-e5b15079d3e4',
              from_time: '16:00:00',
              to_time: '16:15:00',
              phone_number: '081287431054',
              created_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
              created_name: 'Tele MySiloam',
              created_date: '2021-04-22T10:23:34.665Z',
              created_from: 'MySiloam iOS',
              modified_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
              modified_date: '2021-04-22T10:23:34.665Z',
              modified_name: 'Tele MySiloam',
              modified_from: 'MySiloam iOS',
              doctor_id: 'dd9b087a-bc8a-4c35-b12c-b4b6ec1c9716',
              hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
              appointment_date: '2021-04-27',
              contact_id: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
              channel_id: channelId.MOBILE,
              schedule_id: 'bf7eab78-2fd6-4c67-bdbf-034b18fd5f05',
              appointment_no: 0,
              email_address: 'r.lukius@gmail.com',
              contact_name: 'Rezia Lukius Tejaatmaja',
              birth_date: '1998-05-11',
              current_address: 'Karawaci',
              identity_address: null,
              gender_id: '1',
              appointment_status_id: '1',
              is_double_mr: false,
              patient_hope_id: 2000001998612,
              patient_organization_id: 2000000112103,
              organization_id: 2,
              chief_complaint: 'Symptoms',
              zoom_url: 'https://siloamhospitals.zoom.us/j/92681021315?pwd=ZURsaWZHMGl6OVlDS2VEM2VqcHpmZz09',
              aido_transaction_id: null,
              doctor_hope_id: 2000000749,
              delivery_address: '1800 Ellis St, San Francisco, CA 94115, USA',
              admission_status_id: '1',
              payment_status_id: paymentStatus.PAID,
              medical_record_number: 858103
            },
            {
              appointment_id: '6b91847a-de1a-405e-9aa3-e5b15079d3e5',
              from_time: '16:15:00',
              to_time: '16:30:00',
              phone_number: '081287431055',
              created_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
              created_name: 'Tele MySiloam',
              created_date: '2021-04-22T10:23:34.665Z',
              created_from: 'MySiloam iOS',
              modified_by: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcee',
              modified_date: '2021-04-22T10:23:34.665Z',
              modified_name: 'Tele MySiloam',
              modified_from: 'MySiloam iOS',
              doctor_id: 'dd9b087a-bc8a-4c35-b12c-b4b6ec1c9716',
              hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
              appointment_date: '2021-04-27',
              contact_id: '7cf7e8a6-70fc-4d41-9d48-34bc9411fcea',
              channel_id: channelId.MOBILE,
              schedule_id: 'bf7eab78-2fd6-4c67-bdbf-034b18fd5f05',
              appointment_no: 1,
              email_address: 'r.lukius@gmail.com',
              contact_name: 'Rezia Lukius Tejaatmajaa',
              birth_date: '1998-05-11',
              current_address: 'Karawaci',
              identity_address: null,
              gender_id: '1',
              appointment_status_id: '1',
              is_double_mr: false,
              patient_hope_id: 2000001998613,
              patient_organization_id: 2000000112104,
              organization_id: 2,
              chief_complaint: 'Symptoms',
              zoom_url: 'https://siloamhospitals.zoom.us/j/92681021315?pwd=ZURsaWZHMGl6OVlDS2VEM2VqcHpmZz09',
              aido_transaction_id: null,
              doctor_hope_id: 2000000749,
              delivery_address: '1800 Ellis St, San Francisco, CA 94115, USA',
              admission_status_id: '2',
              payment_status_id: paymentStatus.PAID,
              medical_record_number: 858104
            }
          ], status: 'OK', message: 'Get Appointment List Successfully'
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
    if (req.method === 'GET'
      && req.urlWithParams.includes('/appointments/reserved-slot')) {
      return of(new HttpResponse({
        status: 200,
        body: {status: 'OK', data: {key: null}, message: 'Get reserved slot successfully'}
      }));
    }
    if (req.method === 'POST'
      && req.urlWithParams.includes('/appointments/reserved-slot')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          status: 'OK',
          data: {
            scheduleId: 'bf7eab78-2fd6-4c67-bdbf-034b18fd5f05',
            appointmentDate: '2021-04-29',
            appointmentNo: 15,
            channelId: '2',
            userId: 'ef91ac82-350a-4523-87b7-0f0b72f34180',
            source: 'FrontOffice'
          },
          message: 'Slot reserved'
        }
      }));
    }
    console.log(req.method);
    console.log(req.urlWithParams);
    return next.handle(req);
  }

}
