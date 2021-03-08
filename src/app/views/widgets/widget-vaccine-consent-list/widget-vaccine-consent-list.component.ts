import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Consent } from '../../../models/consents/consent';
import { ConsentDetail } from '../../../models/consents/consentDetail';
import { ConsentService } from '../../../services/consent.service';
import { environment } from '../../../../environments/environment';
import { PatientService } from '../../../services/patient.service';
import { ModalSearchPatientComponent } from '../../../views/widgets/modal-search-patient/modal-search-patient.component';
import { PatientHope } from '../../../models/patients/patient-hope';
import { DoctorService } from '../../../services/doctor.service';
import { AdmissionService } from '../../../services/admission.service';
import { Doctor } from '../../../models/doctors/doctor';
import { sourceApps, channelId } from '../../../variables/common.variable';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-widget-vaccine-consent-list',
  templateUrl: './widget-vaccine-consent-list.component.html',
  styleUrls: ['./widget-vaccine-consent-list.component.css'],
})
export class WidgetVaccineConsentListComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public consents: Consent[] = [];
  public consentAnswer: ConsentDetail[] = [];
  public consentInfo: Consent;
  public maskDate = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;
  public patientName: string = '';
  public dob: string = '';
  public age: number = 0;
  public uniqueCode: string = '';
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public showDetailConsent: boolean = false;
  public updateStatus: string = 'initial';
  public separator: string = '<calendar>';
  public choosedPatient: PatientHope;
  public doctorList: Doctor[];
  public doctorSelected: any;
  public isAdmissionCreated: boolean = false;
  public createAdmissionStatus: string = 'initial';
  public isConsentDetailChanged: boolean = false;
  public mrLocal: any;
  public nameFromPatientData: string;
  public dobFromPatientData: string;
  public isFromPatientData: boolean = false;
  public formValidity: any = { remarks: {}, name: null, mobile: null, answers: [], dob: null };

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private admissionService: AdmissionService, 
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
      behavior: 'smooth',
    });
    this.patientService.searchPatientHopeSource$.subscribe((patient) => {
      this.choosedPatient = patient;
      setTimeout(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 500);
    });
    this.doctorService.getListDoctor(this.key.hospital.id).subscribe((res) => {
      this.doctorList = res.data;
    });
    this.isNewPatient();
  }

  isNewPatient() {
    this.mrLocal = this.route.snapshot.queryParams.mrLocal;
    this.uniqueCode = this.route.snapshot.queryParams.code;
    this.nameFromPatientData = this.route.snapshot.queryParams.name;
    this.dobFromPatientData = this.route.snapshot.queryParams.dob;
    if (this.uniqueCode) {
      this.isFromPatientData = true;
      document.documentElement.style.overflow = 'hidden';
      this.searchConsent('code');
    }
  }

  resetFormValidity() {
    this.formValidity = { remarks: {}, name: null, mobile: null, answers: [], dob: null };
  }

  searchConsent(type: string) {
    // set to initial value
    this.resetFormValidity();
    this.updateStatus = 'initial';
    this.choosedPatient = undefined;
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.isAdmissionCreated = false;

    // payload to search consent
    let searchType: number;
    let searchText: string;
    let formattedDob: string = '1990-01-01';
    const orgId = this.key.hospital.orgId;

    if (type === 'code') {
      searchType = 1;
      searchText = this.uniqueCode;
    } else {
      searchType = 2;
      formattedDob = this.formatDate(this.dob, 'MM-DD-YYYY');
      searchText = this.patientName;
    }

    this.consentService
      .searchConsent(searchType, orgId, searchText, formattedDob)
      .subscribe(
        (res) => {
          if (res.status === 'Success') {
            if (res.data.length > 0) {
              this.consents = res.data;
              if (this.isFromPatientData) {
                this.goToDetail(this.consents[0]);
              } else {
                this.isFromPatientData = false;
                document.documentElement.style.overflow = 'auto';
              }
            } else {
              this.showNotFoundMsg = true;
              this.consents = [];
              this.isFromPatientData = false;
              document.documentElement.style.overflow = 'auto';
            }
          } else {
            this.showNotFoundMsg = true;
            this.consents = [];
            this.isFromPatientData = false;
            document.documentElement.style.overflow = 'auto';
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
    ) {
      return;
    }
    this.isConsentDetailChanged = false;
    this.updateStatus = 'initial';
    this.consentInfo = payload;
    this.showDetailConsent = false;
    this.consentService.getDetailAnswer(payload.consent_id).subscribe(
      (res) => {
        this.showDetailConsent = true;
        this.consentAnswer = res.data;
        this.consentInfo = {
          ...this.consentInfo,
          date_of_birth: moment(this.consentInfo.date_of_birth).format(
            'DD-MM-YYYY'
          ),
          checkin_date: this.consentInfo.checkin_date
            ? moment(this.consentInfo.checkin_date).format('DD-MM-YYYY HH:mm')
            : null,
          detail: this.consentAnswer.map((el) => {
            if (el.is_remarks && el.answer_remarks) {
              const date = `${el.answer_remarks[8] + el.answer_remarks[9]}`;
              const month = `${el.answer_remarks[5] + el.answer_remarks[6]}`;
              const year = `${el.answer_remarks[0] + el.answer_remarks[1] + el.answer_remarks[2] + el.answer_remarks[3]}`;
              el.answer_remarks = `${date}-${month}-${year}`;
            }
            return el;
          }),
        };
        this.age = moment().diff(moment(this.formatDate(this.consentInfo.date_of_birth, 'YYYY-MM-DD')), 'years', true);
        if (
          this.isFromPatientData &&
          this.mrLocal &&
          !this.consentInfo.checkin_date
        ) {
          this.patientService
            .searchPatientAccessMr2(this.key.hospital.id, this.mrLocal)
            .subscribe((patient) => {
              this.choosedPatient = patient.data[0];
              this.consentInfo.patient_name = this.choosedPatient.name;
              const date = `${this.choosedPatient.birthDate[8] + this.choosedPatient.birthDate[9]}`;
              const month = `${this.choosedPatient.birthDate[5] + this.choosedPatient.birthDate[6]}`;
              const year = `${this.choosedPatient.birthDate[0] + this.choosedPatient.birthDate[1] + this.choosedPatient.birthDate[2] + this.choosedPatient.birthDate[3]}`;
              this.consentInfo.date_of_birth = `${date}-${month}-${year}`;
              this.consentInfo.mobile_no = this.choosedPatient.mobileNo1;
              this.updateConsent();
              this.isFromPatientData = false;
              document.documentElement.style.overflow = 'auto';
              setTimeout(() => {
                window.scrollTo({
                  left: 0,
                  top: document.body.scrollHeight,
                  behavior: 'smooth',
                });
              }, 500);
            });
        } else if (this.isFromPatientData && this.nameFromPatientData && this.dobFromPatientData) {
          this.consentInfo.patient_name = this.nameFromPatientData;
          this.consentInfo.date_of_birth = this.dobFromPatientData
          this.isFromPatientData = false;
          document.documentElement.style.overflow = 'auto';
          this.updateConsent()
        } else {
          this.isFromPatientData = false;
          document.documentElement.style.overflow = 'auto';
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
        position: 'center',
        type: 'warning',
        title: 'Are you sure you want to leave this form?',
        showConfirmButton: true,
        confirmButtonText: 'Leave',
        showCancelButton: true,
        text: 'Changes you made will be lost',
      }).then((res) => {
        if (res.value) {
          this.resetFormValidity();
          this.getDetailInformation(payload);
        }
      });
    } else {
      this.getDetailInformation(payload);
    }
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  }

  updateConsent() {
    document.documentElement.style.overflow = 'hidden';
    this.updateStatus = 'loading';
    const orgId = this.key.hospital.orgId;
    if (this.checkFormValidity()) {
      this.consentService
        .updateConsent({
          ...this.consentInfo,
          detail: this.filterQuestions(this.consentInfo.detail, this.consentInfo.vaccine_no).map((el) => {
            if (el.answer_value === 'Tidak') {
              el.answer_remarks = '';
            }
            if (el.answer_remarks) {
              el.answer_remarks = this.formatDate(el.answer_remarks, 'YYYY-MM-DD');
            }
            return el;
          }),
          create_user: 'FO',
          organization_id: orgId,
          date_of_birth: `${this.consentInfo.date_of_birth.split('-')[2]}-${this.consentInfo.date_of_birth.split('-')[1]
            }-${this.consentInfo.date_of_birth.split('-')[0]}`,
        })
        .subscribe(
          (res) => {
            this.resetFormValidity();
            document.documentElement.style.overflow = 'auto';
            this.isConsentDetailChanged = false;
            this.updateStatus = 'loaded';
            const foundIndex = this.consents.findIndex(
              (item) => item.consent_id === this.consentInfo.consent_id
            );
            this.consents[foundIndex].vaccine_no = this.consentInfo.vaccine_no;
            this.consentInfo.detail = this.consentInfo.detail.map((el) => {
              if (el.is_remarks && el.answer_remarks) {
                const date = `${el.answer_remarks[8] + el.answer_remarks[9]}`;
                const month = `${el.answer_remarks[5] + el.answer_remarks[6]}`;
                const year = `${el.answer_remarks[0] + el.answer_remarks[1] + el.answer_remarks[2] + el.answer_remarks[3]}`;
                el.answer_remarks = `${date}-${month}-${year}`;
              }
              return el;
            });
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Vaccine consent form updated successfully',
              showConfirmButton: false,
              timer: 2000,
            });
          },
          (err) => {
            this.updateStatus = 'loaded';
            document.documentElement.style.overflow = 'auto';
            Swal.fire({
              position: 'center',
              type: 'error',
              title: 'Vaccine consent form failed to update',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        );
    } else {
      document.documentElement.style.overflow = 'auto';
      this.updateStatus = 'loaded';
    }
  }

  fieldsChange(event: any, id: number) {
    this.isConsentDetailChanged = true;
    this.updateStatus = 'initial';
    const foundIndex = this.consentInfo.detail.findIndex(
      (item) => item.consent_question_id === id
    );
    this.consentInfo.detail[foundIndex].answer_value = event.target.value;
  }

  vaccineNoChange(event: any) {
    this.isConsentDetailChanged = true;
    this.updateStatus = 'initial';
    this.consentInfo.vaccine_no = Number(event.target.value);
  }

  printForm(): void {
    if (this.isConsentDetailChanged) {
      Swal.fire({
        position: 'center',
        type: 'error',
        title: 'Please save the updated consent form before you print',
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
        position: 'center',
        type: 'error',
        title: 'Please save the updated consent form before admitting patient',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      const hospitalId = this.key.hospital.id;
      const params = {
        patientName: this.consentInfo.patient_name,
        birthDate: `${this.consentInfo.date_of_birth.split('-')[2]}-${this.consentInfo.date_of_birth.split('-')[1]
          }-${this.consentInfo.date_of_birth.split('-')[0]}`,
        localMrNo: '',
      };
      const modalRef = this.modalService.open(ModalSearchPatientComponent, {
        windowClass: 'modal-searchPatient',
        size: 'lg',
      });
      modalRef.componentInstance.searchKeywords = {
        ...params,
        hospitalId,
        registerFormId: this.consentInfo.registration_form_id,
        consentCode: this.consentInfo.unique_code,
      };
    }
  }

  setDoctor(item: any) {
    this.doctorSelected = item;
  }

  async handlingCreateAdmission() {
    if (!this.choosedPatient.patientOrganizationId) {
      Swal.fire({
        position: 'center',
        type: 'warning',
        title: 'Your patient doesn\'t have MR local',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        showCancelButton: true,
        text: 'Would you like to create MR local?',
      }).then((res) => {
        if (res.value) {
          this.createAdmissionStatus = 'loading';
          document.documentElement.style.overflow = 'hidden';
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
                    this.createAdmissionStatus = 'loaded';
                    document.documentElement.style.overflow = 'auto';
                    Swal.fire({
                      position: 'center',
                      type: 'success',
                      title: 'MR local succesfully created',
                      showConfirmButton: true,
                      confirmButtonText: 'Yes',
                      showCancelButton: true,
                      text: 'Would you like to continue to create admission?',
                    }).then(async (res) => {
                      if (res.value) {
                        let isSuccess = await this.editPatientHope(this.choosedPatient.patientId, this.consentInfo.email_address);
                        if(isSuccess) {
                          this.createAdmission();
                        }
                      }
                    });
                  });
              },
              (err) => {
                this.createAdmissionStatus = 'loaded';
                document.documentElement.style.overflow = 'auto';
                Swal.fire({
                  position: 'center',
                  type: 'error',
                  title: 'Create MR local failed, please try again later',
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            );
        }
      });
    } else {
      let isSuccess = await this.editPatientHope(this.choosedPatient.patientId, this.consentInfo.email_address);
      if(isSuccess) {
        this.createAdmission();
      }
    }
  }

  async getPatientHope(patientHopeId) {
    let body = await this.patientService.getPatientHopeDetail(patientHopeId)
      .toPromise().then(res => {
        if (res.data) {
          return res.data;
        } else {
          return null;
        }
      }).catch(err => {
        return null;
      });

    return body
  }

  async editPatientHope(patient_Hope_Id, email?) {
    let isSuccess = false;
    let body = await this.getPatientHope(patient_Hope_Id);
    if(body) {
      const { patientId, name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
              subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo1, mobileNo2, emailAddress,
              permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
              nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
              contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
              payerId, payerIdNo, notes } = body;

      let payload = {
        address, allergy, birthDate, birthPlaceId, bloodTypeId, channelId: channelId.FRONT_OFFICE, cityId,
        contactAddress, contactCityId, contactEmailAddress, contactMobileNo, contactName, contactPhoneNo,
        districtId, emailAddress, fatherName, homePhoneNo, hospitalId: this.hospital.id, maritalStatusId,
        mobileNo1, mobileNo2, motherName, name, nationalIdNo, nationalIdTypeId, nationalityId, notes,
        officePhoneNo, organizationId: this.hospital.orgId, patientHopeId: patientId, payerId, payerIdNo,
        permanentAddress, permanentCityId, permanentPostCode, postCode, religionId, sexId, source: sourceApps, 
        spouseName, subDistrictId, titleId, userId: this.user.id, userName: this.user.fullname
      }

      if(email) {
        payload.emailAddress = email; //replace email from preregistration
        isSuccess = await this.mappingProcess(payload);
      }
    }

    return isSuccess;
  }

  async printPatientLabel() {
    let consentId = this.consentInfo.consent_id;
    const contentPdf = await this.admissionService.getPatientLabelVaccine(consentId).toPromise()
      .then(res => {
        return res.data;
      }).catch(err => {
        return null;
      })

    if (contentPdf) {
      await this.filePdfCreated(contentPdf);
    } else {
      Swal.fire({
        position: 'center',
        type: 'error',
        title: 'Cannot print patient label',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  filePdfCreated(val) {
    const {
      patientName, sex, phone, admissionNo, admissionDate,
      alias, mrNoFormatted, barcode, age, admissionTime,
      doctorName, payer, patientType, labelBirth,
    } = val;

    const detailPayer = payer ? payer : patientType;
    const strName = patientName.toUpperCase();
    const strAge = age.toLowerCase();
    let doctorPayer = doctorName + ' / ' + detailPayer;
    doctorPayer = doctorPayer.substr(0, 55);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const docDefinition = {
      pageSize: { width: 292.283, height: 98.031 },
      pageMargins: [0, 0, 0, 0],
      content: [
        { text: strName, style: 'header', bold: true, fontSize: 10, noWrap: true },
        { text: 'Sex: ' + sex + ' / Ph: ' + phone, style: 'header', bold: true, fontSize: 10, noWrap: true },
        { text: 'MR No: ' + alias + '.' + mrNoFormatted + ' / DOB: ' + labelBirth + ' (' + strAge + ') ', style: 'header', bold: true, fontSize: 10 },
        { text: admissionNo + ' ' + admissionDate + ' ' + admissionTime, style: 'header', fontSize: 9 },
        { text: doctorPayer, style: 'header', fontSize: 9 },
        {
          image: barcode,
          width: 100,
          height: 20,
          alignment: 'right'
        }
      ],
      styles: {
        header: {
          fontSize: 9
        }
      }

    };
    pdfMake.defaultFileName = 'report registration';
    pdfMake.createPdf(docDefinition).print();
  }

  async mappingProcess(payload: any) {
    const patient = this.patientService.postMappingPatient(payload)
      .toPromise().then(res => {
        return true;
      }).catch(err => {
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Data patient di HOPE tidak lengkap',
          showConfirmButton: false,
          timer: 2000,
        });
        return false;
      })
    return patient;
  }

  createAdmission() {
    const payloadHope: any = {
      organizationId: this.key.hospital.orgId,
      patientOrganizationId: this.choosedPatient.patientOrganizationId,
      primaryDoctorUserId: this.doctorSelected.doctor_hope_id,
      consentId: this.consentInfo.consent_id
    };

    const payloadCheckin: any = {
      consent_id: this.consentInfo.consent_id,
      organization_id: this.key.hospital.orgId,
      admission_id: 0,
      patient_id: this.choosedPatient.patientId,
      create_user: 'FO',
    };

    this.createAdmissionStatus = 'loading';
    document.documentElement.style.overflow = 'hidden';

    this.consentService.createAdmissionVaccine(payloadHope).subscribe(
      (res) => {
        payloadCheckin.admission_id = res.data.admission_hope_id;
        this.consentService
          .checkinconsent(payloadCheckin)
          .subscribe((checkedInRes) => {
            this.isAdmissionCreated = true;
            const foundIndex = this.consents.findIndex(
              (x) => x.consent_id === this.consentInfo.consent_id
            );
            this.consents[foundIndex].checkin_date = moment().format(
              'YYYY-MM-DDTHH:mm:ss'
            );
            this.consentInfo.checkin_date = moment().format('DD-MM-YYYY HH:mm');
            this.createAdmissionStatus = 'loaded';
            document.documentElement.style.overflow = 'auto';
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Admission successfully created',
              showConfirmButton: false,
              timer: 2000,
            });
            setTimeout(() => {
              window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth',
              });
            }, 500);
          });
      },
      (err) => {
        this.createAdmissionStatus = 'loaded';
        document.documentElement.style.overflow = 'auto';
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Create admission failed, please try again later',
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
        position: 'center',
        type: 'warning',
        title: 'Are you sure you want to leave this form?',
        showConfirmButton: true,
        confirmButtonText: 'Leave',
        showCancelButton: true,
        text: 'Changes you made will be lost',
      }).then((res) => {
        if (res.value) {
          this.router.navigate(['./patient-data'], { queryParams: params });
        }
      });
    } else {
      this.router.navigate(['./patient-data'], { queryParams: params });
    }
  }

  checkFormValidity() {
    // initial parameter
    let isValid: boolean = true;
    const isNum = /^\d*$/;
    const isNameValid = /^[\w .,]+$/;
    const findEmptyAnswer = this.filterQuestions(this.consentInfo.detail, this.consentInfo.vaccine_no).filter((item) => !item.answer_value);

    // check if all reqeuired remarks are filled
    const checkRemarks = this.consentInfo.detail.filter((el) => {
      if (el.answer_remarks !== '' && el.answer_value === 'Ya') {
        if (!this.isDateValid(el.answer_remarks)) {
          this.formValidity.remarks[el.consent_question_id] =
            'Invalid format';
          return el;
        } else if (moment(this.formatDate(el.answer_remarks, 'YYYY-MM-DD')).isAfter(moment())) {
          this.formValidity.remarks[el.consent_question_id] =
            'Date cannot be after Today';
          return el;
        } else if (
          this.isDateValid(el.answer_remarks) &&
          this.formValidity.remarks[el.consent_question_id]
        ) {
          delete this.formValidity.remarks[el.consent_question_id];
        }
      } else if (el.is_remarks && el.answer_value === 'Ya' && !el.answer_remarks) {
        return el;
      }
    });

    if (checkRemarks.length > 0) {
      isValid = false;
    }

    // check if the name is valid
    const checkName = isNameValid.test(this.consentInfo.patient_name);
    if (!checkName) {
      isValid = false;
      this.formValidity.name = 'Invalid format. Only allows a-z, A-Z, 0-9, (,), (.)';
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (this.formValidity.name) {
        this.formValidity.name = null;
      }
    }


    // check if the phone number format are correct
    const checkPhone = isNum.test(this.consentInfo.mobile_no);
    if (!checkPhone) {
      isValid = false;
      this.formValidity.mobile = 'Invalid format';
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (this.formValidity.mobile) {
        this.formValidity.mobile = null;
      }
    }

    // check if all the required questions are answered
    if (findEmptyAnswer.length > 0) {
      isValid = false;
      this.formValidity.answers = findEmptyAnswer;
    } else {
      this.formValidity.answers = [];
    }

    // check if the birthdate format are correct
    if (!this.isDateValid(this.consentInfo.date_of_birth)) {
      isValid = false;
      this.formValidity.dob = 'Invalid format';
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (this.formValidity.dob) {
        this.formValidity.dob = null;
      }
    }

    return isValid;
  }

  onBirthDateBlur(event: any) {
    const date = event.target.value;
    const isDateValid = this.isDateValid(date);
    if (isDateValid) {
      this.age = moment().diff(moment(this.formatDate(date, 'YYYY-MM-DD')), 'years', true);
    }
  }

  isDateValid(value: string) {
    const reformatDate = value.split('-').join('').split('_').join('');
    if (reformatDate.length !== 8) {
      return false;
    } else {
      return true;
    }
  }

  formatDate(value: string, format: string) {
    const date = `${value[0] + value[1]}`;
    const month = `${value[3] + value[4]}`;
    const year = `${value[6] + value[7] + value[8] + value[9]}`;
    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${date}`;
    } else {
      return `${month}-${date}-${year}`;
    }
  }

  filterQuestions(list: any[], vaccineNo: number) {
    let newList: any[];
    if (this.age < 60) {
      newList = list.filter((item: any) => item.is_age === 0);
    } else {
      newList = list.map((x: any) => x);
    }
    if (vaccineNo === 1) {
      return newList.filter((item: any) => item.is_vaccine_seq !== 2);
    } else if (vaccineNo === 2) {
      return newList.filter((item: any) => item.is_vaccine_seq !== 1);
    } else {
      return list;
    }
  }

  createMarkupQuestion1 = (rawQuestion: any) => {
    if (rawQuestion.is_remarks) {
      return `${rawQuestion.consent_question_name.split('?')[0]}?`;
    } else {
      if (rawQuestion.consent_question_name.indexOf(':') >= 0) {
        return rawQuestion.consent_question_name.split(':')[0].replace('>=', '≥')
          + ':';
      } else {
        return rawQuestion.consent_question_name.replace('>=', '≥');
      }
    }
  }
  createMarkupQuestion2 = (rawQuestion: any) => {
    if (!rawQuestion.is_remarks && rawQuestion.consent_question_name.indexOf(':') >= 0) {
      const splitString = rawQuestion.consent_question_name.split(':');
      splitString.shift();
      return splitString.join(':').replace('>=', '≥');
    } else {
      return '';
    }
  }

  createPrintOutQuestion1 = (rawQuestion: any) => {
    if (rawQuestion.is_remarks) {
      return `${this.createMarkupQuestion1(rawQuestion)} ${rawQuestion.consent_question_name.split('?')[1].split(this.separator)[0]}`;
    } else {
      return this.createMarkupQuestion1(rawQuestion);
    }
  }
}
