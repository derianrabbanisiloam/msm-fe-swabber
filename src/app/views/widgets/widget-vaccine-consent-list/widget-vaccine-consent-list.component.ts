import * as moment from "moment";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Consent } from "../../../models/consents/consent";
import { ConsentDetail } from "../../../models/consents/consentDetail";
import { ConsentService } from "../../../services/consent.service";
import { environment } from "../../../../environments/environment";
import { PatientService } from "../../../services/patient.service";
import { ModalSearchPatientComponent } from "../../../views/widgets/modal-search-patient/modal-search-patient.component";
import { PatientHope } from "../../../models/patients/patient-hope";
import { DoctorService } from "../../../services/doctor.service";
import { Doctor } from "../../../models/doctors/doctor";
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
  public updateStatus: string = "initial";
  public separator: string = "<answer>";
  public choosedPatient: PatientHope;
  public doctorList: Doctor[];
  public doctorSelected: any;
  public isAdmissionCreated: boolean = false;
  public createAdmissionStatus: string = "initial";
  public isConsentDetailChanged: boolean = false;

  constructor(
    private doctorService: DoctorService,
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
      behavior: "smooth",
    });
    this.patientService.searchPatientHopeSource$.subscribe((patient) => {
      this.choosedPatient = patient;
      setTimeout(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    });
    this.doctorService.getListDoctor(this.key.hospital.id).subscribe((res) => {
      this.doctorList = res.data;
    });
  }

  searchByCode() {
    const orgId = this.key.hospital.orgId;
    this.updateStatus = "initial";
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.isAdmissionCreated = false;
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
    this.updateStatus = "initial";
    const orgId = this.key.hospital.orgId;
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.isAdmissionCreated = false;
    const date = `${this.dob[0] + this.dob[1]}`;
    const month = `${this.dob[3] + this.dob[4]}`;
    const year = `${this.dob[6] + this.dob[7] + this.dob[8] + this.dob[9]}`;
    const formattedDob = `${month}-${date}-${year}`;
    this.consentService
      .getByNameDob(this.patientName, formattedDob, orgId)
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

  getDetailInformation(payload: any) {
    if (
      this.isAdmissionCreated &&
      payload.consent_id === this.consentInfo.consent_id
    )
      return;
    this.isConsentDetailChanged = false;
    this.updateStatus = "initial";
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
          checkin_date: !this.consentInfo.checkin_date
            ? null
            : moment(this.consentInfo.checkin_date).format("DD-MM-YYYY hh:mm"),
          detail: this.consentAnswer,
        };
      },
      (err) => {
        this.showDetailConsent = false;
      }
    );
  }

  goToDetail(payload: any) {
    if (this.isConsentDetailChanged) {
      Swal.fire({
        position: "center",
        type: "warning",
        title: "Are you sure you want to leave this form?",
        showConfirmButton: true,
        confirmButtonText: "Leave",
        showCancelButton: true,
        text: "Changes you made will be lost",
      }).then((res) => {
        if (res.value) {
          this.getDetailInformation(payload);
        }
      });
    } else {
      this.getDetailInformation(payload);
    }
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }

  updateConsent() {
    document.documentElement.style.overflow = "hidden";
    this.updateStatus = "loading";
    const orgId = this.key.hospital.orgId;
    this.consentService
      .updateConsent({
        ...this.consentInfo,
        create_user: "FO",
        organization_id: orgId,
        date_of_birth: `${this.consentInfo.date_of_birth.split("-")[2]}-${this.consentInfo.date_of_birth.split("-")[1]
          }-${this.consentInfo.date_of_birth.split("-")[0]}`,
      })
      .subscribe(
        (res) => {
          document.documentElement.style.overflow = "auto";
          this.isConsentDetailChanged = false;
          this.updateStatus = "loaded";
          Swal.fire({
            position: "center",
            type: "success",
            title: "Vaccine consent form updated successfully",
            showConfirmButton: false,
            timer: 2000,
          });
        },
        (err) => {
          this.updateStatus = "loaded";
          document.documentElement.style.overflow = "auto";
          Swal.fire({
            position: "center",
            type: "error",
            title: "Vaccine consent form failed to update",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
  }

  fieldsChange(event: any, id: number) {
    this.isConsentDetailChanged = true;
    this.updateStatus = "initial";
    const foundIndex = this.consentInfo.detail.findIndex(
      (item) => item.consent_detail_id === id
    );
    if (event.target.value === "Tidak")
      this.consentInfo.detail[foundIndex].answer_remarks = "";
    this.consentInfo.detail[foundIndex].answer_value = event.target.value;
  }

  printForm(): void {
    if (this.isConsentDetailChanged) {
      Swal.fire({
        position: "center",
        type: "error",
        title: "Please save the updated consent form before you print",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      document.execCommand("print");
    }
  }

  handleformChange(): void {
    this.isConsentDetailChanged = true;
  }

  goToPatientData() {
    if (this.isConsentDetailChanged) {
      Swal.fire({
        position: "center",
        type: "warning",
        title: "Are you sure you want to leave this form?",
        showConfirmButton: true,
        confirmButtonText: "Leave",
        showCancelButton: true,
        text: "Changes you made will be lost",
      }).then((res) => {
        if (res.value) {
          this.router.navigate(["/patient-data"]);
        }
      });
    } else {
      this.router.navigate(["/patient-data"]);
    }
  }

  searchPatientHOPE(e?) {
    if (this.isConsentDetailChanged) {
      Swal.fire({
        position: "center",
        type: "error",
        title: "Please save the updated consent form before admitting patient",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      const hospitalId = this.key.hospital.id;
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

  setDoctor(item) {
    this.doctorSelected = item;
  }

  createAdmission(): void {
    const payloadHope: any = {
      organizationId: this.key.hospital.orgId,
      patientOrganizationId: this.choosedPatient.patientOrganizationId,
      primaryDoctorUserId: this.doctorSelected.doctor_hope_id,
    };

    const payloadCheckin: any = {
      consent_id: this.consentInfo.consent_id,
      organization_id: this.key.hospital.orgId,
      admission_id: 0,
      patient_id: this.choosedPatient.patientId,
      create_user: "FO",
    };

    this.createAdmissionStatus = "loading";
    document.documentElement.style.overflow = "hidden";
    this.consentService.createAdmissionVaccine(payloadHope).subscribe(
      (res) => {
        payloadCheckin.admission_id = res.data.ResultEntityId;
        this.consentService
          .checkinconsent(payloadCheckin)
          .subscribe((checkedInRes) => {
            this.isAdmissionCreated = true;
            const foundIndex = this.consents.findIndex(
              (x) => x.consent_id === this.consentInfo.consent_id
            );
            this.consents[foundIndex].checkin_date = moment().format(
              "DD-MM-YYYY hh:mm"
            );
            this.consentInfo.checkin_date = moment().format("DD-MM-YYYY hh:mm");
            this.createAdmissionStatus = "loaded";
            document.documentElement.style.overflow = "auto";
            Swal.fire({
              position: "center",
              type: "success",
              title: "Admission successfully created",
              showConfirmButton: false,
              timer: 2000,
            });
            setTimeout(() => {
              window.scrollTo({
                left: 0,
                top: 0,
                behavior: "smooth",
              });
            }, 500);
          });
      },
      (err) => {
        this.createAdmissionStatus = "loaded";
        document.documentElement.style.overflow = "auto";
        Swal.fire({
          position: "center",
          type: "error",
          title: "Create admission failed, please try again later",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }
}
