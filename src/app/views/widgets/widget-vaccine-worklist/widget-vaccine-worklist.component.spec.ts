import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { WidgetVaccineWorklistComponent } from './widget-vaccine-worklist.component';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAlertModule, NgbPopoverModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {TextMaskModule} from 'angular2-text-mask';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {mockLocalStorage, VaccineInterceptor} from '../../pages/page-vaccine-worklist/page-vaccine-worklist.component.spec';
import {By} from '@angular/platform-browser';

describe('WidgetVaccineWorklistComponent', () => {
  let component: WidgetVaccineWorklistComponent;
  let fixture: ComponentFixture<WidgetVaccineWorklistComponent>;

  beforeEach(async(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      declarations: [ WidgetVaccineWorklistComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        TextMaskModule,
        NgbPopoverModule,
        NgbProgressbarModule,
        MyDateRangePickerModule
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
    fixture = TestBed.createComponent(WidgetVaccineWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should be able to render items', fakeAsync(() => {
    fixture.whenStable();
    fixture.detectChanges();
    const totalRow = fixture.debugElement.queryAll(By.css('.vaccine-worklist tbody .worklist-item'));

    expect(totalRow.length).toEqual(2);
  }));

  [

    {
      index: 0,
      expected: ['D925FE13', 'D925FE20'],
    },
    {
      index: 2,
      expected: ['D925FE13'],
    },
    {
      index: 1,
      expected: ['D925FE20'],
    }
  ].forEach((item) => {
    it(`should be able to filter by iteration: ${item.index}`, fakeAsync(() => {
      fixture.whenStable();
      fixture.detectChanges();

      const select: HTMLSelectElement = fixture.debugElement.query(By.css('#iteration-option')).nativeElement;
      select.selectedIndex = item.index;
      select.dispatchEvent(new Event('change'));
      tick(1000);
      fixture.detectChanges();

      const contents = fixture.debugElement.queryAll(By.css('.vaccine-worklist tbody .worklist-item td:nth-child(2)'))
        .map(e => e.nativeElement.textContent);

      expect(contents).toEqual(item.expected);
    }));
  });
});
