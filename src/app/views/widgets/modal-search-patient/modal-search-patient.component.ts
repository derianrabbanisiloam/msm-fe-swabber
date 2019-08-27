import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '../../../services/patient.service';
import { PatientHope } from '../../../models/patients/patient-hope';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal-search-patient',
  templateUrl: './modal-search-patient.component.html',
  styleUrls: ['./modal-search-patient.component.css']
})
export class ModalSearchPatientComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  @Input() searchKeywords: any;
  public patientHope: PatientHope[];
  public searchLoader: boolean = false;

  constructor(
    private patientService: PatientService,
    public activeModal: NgbActiveModal,
    public ngbProgressbarConfig: NgbProgressbarConfig
  ) {
    this.ngbProgressbarConfig.max = 1000;
    this.ngbProgressbarConfig.striped = true;
    this.ngbProgressbarConfig.animated = true;
    this.ngbProgressbarConfig.type = 'success';
    this.ngbProgressbarConfig.height = '20px';

  }

  ngOnInit() {
    if (this.searchKeywords.localMrNo && this.searchKeywords.hospitalId) {
      this.getSearchedPatient2();
    } else {
      this.getSearchedPatient1();
    }
  }

  close() {
    this.activeModal.close();
  }

  getSearchedPatient1() {
    this.searchLoader = true;
    const hospitalId = this.searchKeywords.hospitalId;
    const patientName = this.searchKeywords.patientName;
    const birthDate = this.searchKeywords.birthDate;
    this.patientService.searchPatientHope1(hospitalId, patientName, birthDate).subscribe(
      data => {
        this.searchLoader = false;
        this.patientHope = data.data;
      }
    )
  }

  getSearchedPatient2() {
    this.searchLoader = true;
    const hospitalId = this.searchKeywords.hospitalId;
    const localMrNo = this.searchKeywords.localMrNo;
    this.patientService.searchPatientHope2(hospitalId, localMrNo).subscribe(
      data => {
        this.searchLoader = false;
        this.patientHope = data.data;
      }
    )
  }

  choosePatient(item: any) {
    this.patientService.changeSearchPatientHope(item);
  }

}
