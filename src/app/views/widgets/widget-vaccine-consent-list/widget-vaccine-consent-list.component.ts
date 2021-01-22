import * as moment from "moment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Consent } from "../../../models/consents/consent";
import { ConsentDetail } from "../../../models/consents/ConsentDetail";
import { ConsentService } from "../../../services/consent.service";
import { environment } from "../../../../environments/environment";
import { PatientService } from "../../../services/patient.service";
import { ModalSearchPatientComponent } from "../../../views/widgets/modal-search-patient/modal-search-patient.component";
import { PatientHope } from "../../../models/patients/patient-hope";

@Component({
  selector: "app-widget-vaccine-consent-list",
  templateUrl: "./widget-vaccine-consent-list.component.html",
  styleUrls: ["./widget-vaccine-consent-list.component.css"],
})
export class WidgetVaccineConsentListComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public consents: Consent[] = [];
  public consentAnswer: ConsentDetail[] = [];
  public consentInfo: Consent;
  public maskBirth = [/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
  public key: any = JSON.parse(localStorage.getItem("key"));
  public patientName: string = "";
  public dob: string = "";
  public uniqueCode: string = "";
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public showDetailConsent: boolean = false;
  public showMessage: { isShow: boolean; message: string; class: string } = {
    isShow: false,
    message: "",
    class: "",
  };
  public updateStatus: string = "Initial";
  public separator: string = "<answer>";
  public choosedPatient: PatientHope;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private consentService: ConsentService,
    private router: Router
  ) { }

  ngOnInit() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "auto",
    });
    this.patientService.searchPatientHopeSource$.subscribe((x) => {
      this.choosedPatient = x;
      console.log(this.choosedPatient);
    });
  }

  searchByCode() {
    const orgId = this.key.hospital.orgId;
    this.updateStatus = "Initial";
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.consentService.getByCode(this.uniqueCode, orgId).subscribe(
      (res) => {
        if (res.status === "Success") {
          if (res.data.length > 0) {
            this.consents = res.data;
          } else {
            this.showNotFoundMsg = true;
            this.consents = [];
          }
        } else {
          this.showNotFoundMsg = true;
          this.consents = [];
        }
        this.showWaitMsg = false;
      },
      (err) => {
        this.showWaitMsg = false;
        this.showNotFoundMsg = true;
        this.consents = [];
      }
    );
  }

  searchByNameDob() {
    this.updateStatus = "Initial";
    const orgId = this.key.hospital.orgId;
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.consentService
      .getByNameDob(this.patientName, this.dob, orgId)
      .subscribe(
        (res) => {
          if (res.status === "Success") {
            if (res.data.length > 0) {
              this.consents = res.data;
            } else {
              this.showNotFoundMsg = true;
              this.consents = [];
            }
          } else {
            this.showNotFoundMsg = true;
            this.consents = [];
          }
          this.showWaitMsg = false;
        },
        (err) => {
          this.showWaitMsg = false;
          this.showNotFoundMsg = true;
          this.consents = [];
        }
      );
  }

  goToDetail(payload: any) {
    this.updateStatus = "Initial";
    this.consentInfo = payload;
    this.showDetailConsent = false;
    this.consentService.getDetailAnswer(payload.consent_id).subscribe(
      (res) => {
        this.showDetailConsent = true;
        this.consentAnswer = res.data;
        this.consentInfo = {
          ...this.consentInfo,
          date_of_birth: moment(this.consentInfo.date_of_birth).format(
            "DD-MM-YYYY"
          ),
          checkin_date: !this.consentInfo.checkin_date ? null : moment(this.consentInfo.checkin_date).format(
            "DD-MM-YYYY hh:mm"
          ),
          detail: this.consentAnswer,
        };
      },
      (err) => {
        this.showDetailConsent = false;
      }
    );
  }

  updateConsent() {
    this.updateStatus = "Loading";
    const orgId = this.key.hospital.orgId;
    this.consentService
      .putConsent({
        ...this.consentInfo,
        create_user: "FO",
        organization_id: orgId,
        date_of_birth: `${this.consentInfo.date_of_birth.split("-")[2]}-${this.consentInfo.date_of_birth.split("-")[1]
          }-${this.consentInfo.date_of_birth.split("-")[0]}`,
      })
      .subscribe(
        (res) => {
          this.updateStatus = "Success";
        },
        (err) => {
          this.updateStatus = "Failed";
        }
      );
  }

  fieldsChange(event: any, id: number) {
    this.updateStatus = "Initial";
    const foundIndex = this.consentInfo.detail.findIndex(
      (item) => item.consent_detail_id === id
    );
    if (event.target.value === "Tidak")
      this.consentInfo.detail[foundIndex].answer_remarks = "";
    this.consentInfo.detail[foundIndex].answer_value = event.target.value;
  }

  getAlertClass() {
    switch (this.updateStatus) {
      case "Loading":
        return "alert alert-warning";
      case "Success":
        return "alert alert-success";
      case "Failed":
        return "alert alert-fail";
      default:
        return "alert-none";
    }
  }

  printForm() {
    document.execCommand("print");
  }

  goToPatientData() {
    this.router.navigate(["/patient-data"]);
  }
  searchPatientHOPE(e?) {
    // this.isSubmitting = false;
    // if (this.checkSearchInput() === false) {
    //   return false;
    // }
    // if (e && Number(e.keyCode) !== 13) {
    //   return false;
    // }

    const hospitalId = this.key.hospital.id;
    // let birthDate = null;
    // if (!this.model.localMrNo) {
    //   const dob = this.model.birthDate.split('-');
    //   birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
    // }
    const params = {
      patientName: this.consentInfo.patient_name,
      birthDate: `${this.consentInfo.date_of_birth.split("-")[2]}-${this.consentInfo.date_of_birth.split("-")[1]
        }-${this.consentInfo.date_of_birth.split("-")[0]}`,
      localMrNo: "",
    };
    const modalRef = this.modalService.open(ModalSearchPatientComponent, {
      windowClass: "modal-searchPatient",
      size: "lg",
    });
    modalRef.componentInstance.searchKeywords = { ...params, hospitalId };
  }
}
