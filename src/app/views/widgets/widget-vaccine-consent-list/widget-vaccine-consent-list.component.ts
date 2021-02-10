import * as moment from "moment";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
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
import { sourceApps, channelId } from "../../../variables/common.variable";
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
  public mrLocal: any;
  public isFromPatientData: boolean = false;
  public formValidity: any = { remarks: {}, mobile: null };

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private consentService: ConsentService,
    private router: Router,
    private route: ActivatedRoute
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
    this.isNewPatient();
  }

  isNewPatient() {
    this.mrLocal = this.route.snapshot.queryParams["mrLocal"];
    this.uniqueCode = this.route.snapshot.queryParams["code"];
    if (this.mrLocal && this.uniqueCode) {
      this.isFromPatientData = true;
      document.documentElement.style.overflow = "hidden";
      this.searchByCode();
    }
  }

  searchByCode() {
    this.formValidity = { remarks: {}, mobile: null };
    const orgId = this.key.hospital.orgId;
    this.updateStatus = "initial";
    this.choosedPatient = undefined;
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.isAdmissionCreated = false;
    this.consentService.getByCode(this.uniqueCode, orgId).subscribe(
      (res) => {
        if (res.status === "Success") {
          if (res.data.length > 0) {
            this.consents = res.data;
            if (this.isFromPatientData) {
              this.goToDetail(this.consents[0]);
            } else {
              this.isFromPatientData = false;
              document.documentElement.style.overflow = "auto";
            }
          } else {
            this.showNotFoundMsg = true;
            this.consents = [];
            this.isFromPatientData = false;
            document.documentElement.style.overflow = "auto";
          }
        } else {
          this.showNotFoundMsg = true;
          this.consents = [];
          this.isFromPatientData = false;
          document.documentElement.style.overflow = "auto";
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
    this.formValidity = { remarks: {}, mobile: null };
    this.updateStatus = "initial";
    const orgId = this.key.hospital.orgId;
    this.consents = [];
    this.choosedPatient = undefined;
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
          checkin_date: this.consentInfo.checkin_date
            ? moment(this.consentInfo.checkin_date).format("DD-MM-YYYY HH:mm")
            : null,
          detail: this.consentAnswer,
        };
        if (
          this.isFromPatientData &&
          this.mrLocal &&
          !this.consentInfo.checkin_date
        ) {
          this.patientService
            .searchPatientAccessMr2(this.key.hospital.id, this.mrLocal)
            .subscribe((patient) => {
              this.choosedPatient = patient.data[0];
              this.isFromPatientData = false;
              document.documentElement.style.overflow = "auto";
              setTimeout(() => {
                window.scrollTo({
                  left: 0,
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }, 500);
            });
        } else {
          this.isFromPatientData = false;
          document.documentElement.style.overflow = "auto";
        }
      },
      (err) => {
        this.showDetailConsent = false;
      }
    );
  }

  goToDetail(payload: any) {
    this.choosedPatient = undefined;
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
          this.formValidity = { remarks: {}, mobile: null };
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
    if (this.checkFormValidity()) {
      this.consentService
        .updateConsent({
          ...this.consentInfo,
          detail: this.consentInfo.detail.filter((el) => {
            if (el.answer_value === "Tidak") {
              el.answer_remarks = "";
            }
            return el;
          }),
          create_user: "FO",
          organization_id: orgId,
          date_of_birth: `${this.consentInfo.date_of_birth.split("-")[2]}-${this.consentInfo.date_of_birth.split("-")[1]
            }-${this.consentInfo.date_of_birth.split("-")[0]}`,
        })
        .subscribe(
          (res) => {
            this.formValidity = { remarks: {}, mobile: null };
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
    } else {
      document.documentElement.style.overflow = "auto";
      this.updateStatus = "loaded";
    }
  }

  fieldsChange(event: any, id: number) {
    this.isConsentDetailChanged = true;
    this.updateStatus = "initial";
    const foundIndex = this.consentInfo.detail.findIndex(
      (item) => item.consent_detail_id === id
    );
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
      window.print();
    }
  }

  handleformChange(): void {
    this.isConsentDetailChanged = true;
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
      modalRef.componentInstance.searchKeywords = {
        ...params,
        hospitalId,
        registerFormId: this.consentInfo.registration_form_id,
        consentCode: this.consentInfo.unique_code,
      };
    }
  }

  setDoctor(item) {
    this.doctorSelected = item;
  }

  handlingCreateAdmission() {
    if (!this.choosedPatient.patientOrganizationId) {
      Swal.fire({
        position: "center",
        type: "warning",
        title: "Your patient doesn't have MR local",
        showConfirmButton: true,
        confirmButtonText: "Yes",
        showCancelButton: true,
        text: "Would you like to create MR local?",
      }).then((res) => {
        if (res.value) {
          this.createAdmissionStatus = "loading";
          document.documentElement.style.overflow = "hidden";
          this.patientService
            .createMrLocal({
              patientHopeId: this.choosedPatient.patientId,
              organizationId: Number(this.key.hospital.orgId),
              channelId: channelId.FRONT_OFFICE,
              userId: this.key.user.id,
              source: sourceApps,
              userName: this.key.user.fullname,
              onlyHope: true,
            })
            .subscribe(
              (res) => {
                this.patientService
                  .searchPatientAccessMr2(
                    this.key.hospital.id,
                    res.data.mrLocal
                  )
                  .subscribe((patient) => {
                    this.choosedPatient = patient.data[0];
                    this.createAdmissionStatus = "loaded";
                    document.documentElement.style.overflow = "auto";
                    Swal.fire({
                      position: "center",
                      type: "success",
                      title: "MR local succesfully created",
                      showConfirmButton: true,
                      confirmButtonText: "Yes",
                      showCancelButton: true,
                      text: "Would you like to continue to create admission?",
                    }).then((res) => {
                      if (res.value) {
                        this.createAdmission();
                      }
                    });
                  });
              },
              (err) => {
                this.createAdmissionStatus = "loaded";
                document.documentElement.style.overflow = "auto";
                Swal.fire({
                  position: "center",
                  type: "error",
                  title: "Create MR local failed, please try again later",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            );
        }
      });
    } else {
      this.createAdmission();
    }
  }

  createAdmission() {
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
              "YYYY-MM-DDTHH:mm:ss"
            );
            this.consentInfo.checkin_date = moment().format("DD-MM-YYYY HH:mm");
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

  createNewPatientData() {
    const params = {
      formId: this.consentInfo.registration_form_id,
      code: this.consentInfo.unique_code,
    };
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
          this.router.navigate(["./patient-data"], { queryParams: params });
        }
      });
    } else {
      this.router.navigate(["./patient-data"], { queryParams: params });
    }
  }

  checkFormValidity() {
    let isValid: boolean = true;
    const isNum = /^\d*$/;
    const isRemarksValid = /^[0-9.,]*$/;

    const checkRemarks = this.consentInfo.detail.filter((el) => {
      if (el.answer_remarks !== "" && el.answer_value === "Ya") {
        if (!isRemarksValid.test(el.answer_remarks)) {
          return el;
        } else if (isRemarksValid.test(el.answer_remarks) && this.formValidity.remarks[el.consent_question_id]) {
          delete this.formValidity.remarks[el.consent_question_id]
        }
      }
    });

    if (checkRemarks.length > 0) {
      isValid = false;
      for (let i = 0; i < checkRemarks.length; i++) {
        this.formValidity.remarks[checkRemarks[i].consent_question_id] =
          "Invalid format";
      }
    }

    const checkPhone = isNum.test(this.consentInfo.mobile_no);

    if (!checkPhone) {
      isValid = false;
      this.formValidity.mobile = "Invalid format";
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    } else {
      if (this.formValidity.mobile) {
        this.formValidity.mobile = null
      }
    }

    return isValid;
  }
}
