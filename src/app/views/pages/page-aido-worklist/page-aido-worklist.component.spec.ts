import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAidoWorklistComponent } from './page-aido-worklist.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PageAidoWorklistModule} from './page-aido-worklist.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AidoWorklistInterceptor} from '../../widgets/widget-aido-worklist/widget-aido-worklist.component.spec';
import {mockLocalStorage} from '../page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {DoctorInterceptor} from '../../../interceptors/doctor-interceptor';

describe('PageAidoWorklistComponent', () => {
  let component: PageAidoWorklistComponent;
  let fixture: ComponentFixture<PageAidoWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        PageAidoWorklistModule
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
    fixture = TestBed.createComponent(PageAidoWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
