import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {rescheduleAidoCountResponse, rescheduleAidoResponse} from '../mocks/reschedule-aido';

export class RescheduleWorklistInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET' && req.urlWithParams.includes('/appointments/reschedules/aido')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...rescheduleAidoResponse,
        }
      }));
    }
    if (req.method === 'GET' && req.urlWithParams.includes('/appointments/reschedules/count/aido')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          ...rescheduleAidoCountResponse,
        }
      }));
    }
    return next.handle(req);
  }

}
