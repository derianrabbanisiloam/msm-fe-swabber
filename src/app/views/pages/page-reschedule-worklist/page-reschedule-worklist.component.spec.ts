import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRescheduleWorklistComponent } from './page-reschedule-worklist.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {PageRescheduleWorklistModule} from './page-reschedule-worklist.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RescheduleWorklistInterceptor} from '../../../interceptors/reschedule-worklist-interceptor';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';
import {mockLocalStorage} from '../page-vaccine-worklist/page-vaccine-worklist.component.spec';

describe('PageRescheduleWorklistComponent', () => {
  let component: PageRescheduleWorklistComponent;
  let fixture: ComponentFixture<PageRescheduleWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PageRescheduleWorklistModule
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
    fixture = TestBed.createComponent(PageRescheduleWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
