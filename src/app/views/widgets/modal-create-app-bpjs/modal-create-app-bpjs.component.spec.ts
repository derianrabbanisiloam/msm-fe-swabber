import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateAppBpjsComponent } from './modal-create-app-bpjs.component';

describe('ModalCreateAppBpjsComponent', () => {
  let component: ModalCreateAppBpjsComponent;
  let fixture: ComponentFixture<ModalCreateAppBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateAppBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateAppBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
