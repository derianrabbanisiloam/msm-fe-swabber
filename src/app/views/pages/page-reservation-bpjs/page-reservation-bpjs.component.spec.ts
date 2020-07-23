import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageReservationBpjsComponent } from './page-reservation-bpjs.component';

describe('PageReservationBpjsComponent', () => {
  let component: PageReservationBpjsComponent;
  let fixture: ComponentFixture<PageReservationBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageReservationBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageReservationBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
