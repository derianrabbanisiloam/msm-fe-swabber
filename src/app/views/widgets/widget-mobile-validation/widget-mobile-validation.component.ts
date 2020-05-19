import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { GeneralService } from '../../../services/general.service';
import { AccountMobile } from '../../../models/patients/account-mobile';
import { sourceApps, mobileStatus, contactStatus, channelId, typeFile, formatFile } from '../../../variables/common.variable';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { dateFormatter } from '../../../utils/helpers.util';

@Component({
  selector: 'app-widget-mobile-validation',
  templateUrl: './widget-mobile-validation.component.html',
  styleUrls: ['./widget-mobile-validation.component.css']
})
export class WidgetMobileValidationComponent implements OnInit {
  public maxSize10MB: number = 10485760;
  public assetPath = environment.ASSET_PATH;
  public urlDisclaimer = environment.GET_IMAGE_DISCLAIMER;
  public getDisclaimer;
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public accountList: AccountMobile[];
  public keywords = { offset: 0, limit: 10, searchString: '' };

  private page: number = 0;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;

  public mrLocal: any;
  public selectedAccount: any;
  public patientList: any;
  public suggestionList: any;
  public isFound: boolean = false;
  public currentPatientHope: any;
  public patientHope;
  public flagSearch: boolean = false;
  public selectPatient: any;
  public dataContact: any;
  public dataPatientHope: any;
  public editEmail: string;
  public editContactPayload: any;
  public flagFile1: boolean = false;
  public validUpload1: boolean = false;
  public validUpload2: boolean = false;
  public flagEmail: boolean = false;
  public loadingBar: boolean = false;
  public loadingBarTwo: boolean = false;
  public checkData: boolean = false;
  public flagAlert: boolean = false;

  public mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public model: any = {};
  public params: any = { name: '', birth: '' };
  public detailPatient: any;
  public closeResult: string;
  public alerts: Alert[] = [];

  public showNotFoundMsgSrc: boolean = false;
  public showWaitMsgSrc: boolean = true;
  public showNotFoundMsg: boolean = false;
  public showWaitMsg: boolean = true;
  public mobileStatus = mobileStatus;
  public contactStatus = contactStatus;
  public assetDisclaimer: any = null;
  public formPrint;
  uploadForm: FormGroup;
  public postHope: any;
  public patientHopeId: any;
  public phoneNumberOne: any;
  public phoneNumberTwo: any;
  public flagCountOne: boolean = false;
  public flagCountTwo: boolean = false;
  public dateBirth: any;
  public searchPatient: boolean = false;
  public nameHope: any;
  public birthDateFormat: any;
  public addressHope: any;
  public formatFileServer: any;
  public formatFlag: boolean = false;
  public urlDownload: any;
  public fileName: any;
  public loadingBut: boolean = false;
  public confirmBut: boolean = false;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    modalSetting: NgbModalConfig,
  ) {
    this.formPrint = [
      {header: 'Name'},
      {header: 'Date of Birth'},
      {header: 'No. MR Central'},
      {header: 'Mobile Number'},
      {header: 'Email'}];

    modalSetting.backdrop = 'static';
    modalSetting.keyboard = false;
   }

  ngOnInit() {
    this.getListAccount();
    this.getCollectionAlert();
    this.uploadForm = this.formBuilder.group({
      disclaimer: [''],
      checkboxPatient: new FormControl('checkboxPatient'),
    });
  }

  onPrint(){
    window.print();
  }

  printAll() {
    document.execCommand('print');
  }

  checkDataPatient() {
    this.checkData === false ? this.checkData = true : this.checkData = false;
  }

  deleteDisclaimer() {
    this.uploadForm.get('disclaimer').setValue(null);
    this.flagFile1 = false;
  }

  uploadDisclaimer(event){
    if (event.target.files.length > 0) {
      if(event.target.files[0].type === typeFile.image || event.target.files[0].type === typeFile.pdf) {
        if(event.target.files[0].size > this.maxSize10MB) {
          Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Max size 10MB',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          this.flagFile1 = true;
          const file = event.target.files[0];
          this.uploadForm.get('disclaimer').setValue(file);
        }
      } else {
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Format file JPG and PDF only',
          showConfirmButton: false,
          timer: 2000
        })
      }
    }
  }

  async onSubmitUpload() {
    const formData_1 = new FormData();
    formData_1.append('uploader', 'disclaimer_1');
    formData_1.append('filePdf', this.uploadForm.get('disclaimer').value);

    if(this.dataContact.email_address) {
      if(this.uploadForm.get('disclaimer').value) {
        this.assetDisclaimer = await this.patientService.uploadImage(formData_1)
          .toPromise().then(res => {
            return res.data;
          }).catch(err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err.error.message,
              timer: 4000
            })
          });
      }
    if(this.selectedAccount.mobile_status !== mobileStatus.ACCESSED) {
        if(this.assetDisclaimer) {
          await this.editContactUpload(this.assetDisclaimer.name);
          await this.editDataContact(this.assetDisclaimer.name);
        } else {
          await this.editContactUpload(null);
          await this.editDataContact(null);
        }
      }
      else if (this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
        if(this.assetDisclaimer) {
          this.editDataContact(this.assetDisclaimer.name);
        } else {
          this.editDataContact(null);
        }
        
      }
    }
  }

  async editContactUpload(disclaimer) { //open access MR
    let body;
    body = {
      contactId: this.dataContact.contact_id,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.username
    }
    if(disclaimer) {
      body.disclaimer = disclaimer;
    }
    this.patientService.uploadContact(body).subscribe(
      data => {
        this.assetDisclaimer = null;
        this.flagFile1 = false;
        this.uploadForm.get('disclaimer').setValue(null);
        this.flagAlert = true;
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Patient portal access opened, please instruct patient to open patient portal',
          showConfirmButton: false,
          timer: 5000
        })
        this.getListAccount();
        this.selectedAccount.contact_status_id = contactStatus.VERIFIED;
        this.selectedAccount.mobile_status = mobileStatus.ACCESSED;
        this.choosedAccount(this.selectedAccount);
      }, error => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  openLarge(modal: any) {
    this.modalService.open(modal, { windowClass: 'fo_modal_admission' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async verifyPatient() {
    this.confirmBut = true;
    this.activeModal.close();
    const payload = {
      patientHopeId: this.selectPatient.patientId,
      contactId: this.selectedAccount.contact_id,
      hospitalId: this.hospital.id,
      userId: this.user.id,
      source: sourceApps
    };
    await this.patientService.verifyPatient(payload).toPromise()
      .then(res => {
        this.selectedAndUpdate(res.data);
      }).catch(err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err.error.message,
          timer: 4000
        })
        return null;
      });
  }

  async selectedAndUpdate(result) {
    let dataUpdate = await this.updateEmailMobile(this.selectPatient, this.selectedAccount);
      if(dataUpdate) {
        this.confirmBut = false;
        this.modalService.dismissAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          text: 'Verify Patient Success',
          showConfirmButton: false,
          timer: 3000
        })
        this.getListAccount();
        this.selectedAccount.contact_id = result.contact_id;
        this.selectedAccount.contact_status_id = contactStatus.VERIFIED;
        this.selectedAccount.mobile_status = mobileStatus.ACTIVE;
        this.choosedAccount(this.selectedAccount);
      } else {
        this.confirmBut = false;
        this.modalService.dismissAll();
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          text: 'Verify Patient Success',
          showConfirmButton: false,
          timer: 3000
        })
        this.getListAccount();
        this.selectedAccount.contact_id = result.contact_id;
        this.selectedAccount.contact_status_id = contactStatus.VERIFIED;
        this.selectedAccount.mobile_status = mobileStatus.ACTIVE;
        this.choosedAccount(this.selectedAccount);
      }
  }

  editDataContact(disclaimer){
    let body;
    if(this.selectedAccount.mobile_status !== mobileStatus.ACCESSED) {
      this.editContactPayload = {
        contactId: this.dataContact.contact_id,
        data: {
          emailAddress: this.dataContact.email_address
        },
        userId: this.user.id,
        userName: this.user.username,
        source: sourceApps
      };
      body = {
        ...this.editContactPayload
      }
    } else if(this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
      this.editContactPayload = {
        contactId: this.dataContact.contact_id,
        userId: this.user.id,
        userName: this.user.username,
        source: sourceApps
      };
      body = {
        ...this.editContactPayload,
        data: {}
      }
      this.editEmail !== this.dataContact.email_address ? 
      body.data.emailAddress = this.dataContact.email_address : '';
      disclaimer ? body.data.disclaimer1 = disclaimer : ''; //replace disclaimer when already opened access MR 
    }

    this.patientService.updateContact(this.selectedAccount.contact_id, body).subscribe(
      data => {
        this.getListAccount();
        if(disclaimer) {
          this.getDisclaimer = null;
          this.formatFileServer = disclaimer.split('.');
          this.fileName = disclaimer;
          this.urlDownload = this.urlDisclaimer + disclaimer;
          if(this.formatFileServer[1] === formatFile.pdf) {
            this.formatFlag = true;
            this.getDisclaimer = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDisclaimer + disclaimer);
          } else {
            this.formatFlag = false;
            this.getDisclaimer = this.urlDisclaimer + disclaimer;
          }
        }
        this.flagFile1 = false;
        this.uploadForm.get('disclaimer').setValue(null);
        if(this.flagAlert === false) {  
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Edit Success',
            showConfirmButton: false,
            timer: 3000
          })
        }
      }, error => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  getSearchedPatient1() {
    this.searchPatient = true;
    this.flagSearch = false;
    this.loadingBarTwo = true;
    this.dateBirth = moment(this.selectedAccount.birth_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    this.patientService.searchPatientAccessMr(this.selectedAccount.name, this.dateBirth).subscribe(
      data => {
        this.loadingBarTwo = false;
        this.flagSearch = true;
        let newData = data.data;
        if(newData.length){
          let birthDate;
          let dob;
          this.patientHope = newData;
          for (let i = 0, length = newData.length; i < length; i += 1){
            dob = this.patientHope[i].birthDate.split('-');
            birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
            this.patientHope[i].newBirthDate = birthDate;
          }
        }
        else {
          this.loadingBarTwo = false;
          this.flagSearch = true;
          this.patientHope = null;
        }
      }, error => {
        this.loadingBarTwo = false;
        this.flagSearch = true;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  getSearchedPatient2() {
    this.searchPatient = false;
    this.flagSearch = false;
    this.loadingBarTwo = true;
    this.patientService.searchPatientAccessMr2(this.hospital.id, this.mrLocal).subscribe(
      data => {
        this.loadingBarTwo = false;
        this.flagSearch = true;
        let newData = data.data;
        if(newData.length){
          let birthDate;
          let dob;
          this.patientHope = newData;
          for (let i = 0, length = newData.length; i < length; i += 1){
            dob = this.patientHope[i].birthDate.split('-');
            birthDate = dob[2] + '-' + dob[1] + '-' + dob[0];
            this.patientHope[i].newBirthDate = birthDate;
          }
        }
        else {
          this.loadingBarTwo = false;
          this.patientHope = null;
        }
      }, error => {
        this.loadingBarTwo = false;
        this.flagSearch = true;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  async getPatientHopeId(val) {
    let body = await this.patientService.getPatientHopeDetail(val.patientId)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err.error.message,
          timer: 4000
        })
        return null;
      });

    return body
  }

  async updateEmailMobile(patientData, contactData) {
    let body = await this.getPatientHopeId(patientData);
    if(body) {
      const { patientId, name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
              subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo1, mobileNo2, emailAddress,
              permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
              nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
              contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
              payerId, payerIdNo, notes } = body;

      let bodyTwo = {
        name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
        subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo1, mobileNo2, emailAddress,
        permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
        nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
        contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
        payerId, payerIdNo, notes, patientOrganizationId : patientData.patientOrganizationId, organizationId: patientData.hospitalId,
        channelId: null, userId: null, source: null, userName: null
      }

      if(contactData.phone_number_1 || contactData.email_address) {
        bodyTwo.mobileNo1 = this.charRemove(contactData.phone_number_1) || mobileNo1;
        bodyTwo.emailAddress = contactData.email_address || emailAddress;
        bodyTwo.channelId = channelId.FRONT_OFFICE;
        bodyTwo.userId = this.user.id;
        bodyTwo.source = sourceApps;
        bodyTwo.userName = this.user.fullname;

        let dataUpdate = await this.patientService.updatePatientComplete(bodyTwo, patientId)
        .toPromise().then(res => {
          return res.data;
        }).catch(err => {
          return null;
        });

        return dataUpdate
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async editPatientHopeId(val, content) {
    let body = await this.getPatientHopeId(val);
    if(body) {
      const { patientId, name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
              subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo1, mobileNo2, emailAddress,
              permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
              nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
              contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
              payerId, payerIdNo, notes } = body;
            
      this.patientHopeId = patientId;

      let bodyTwo = {
        name, sexId, birthPlaceId, birthDate, titleId, maritalStatusId, address, cityId, districtId, 
        subDistrictId, postCode, homePhoneNo, officePhoneNo, mobileNo2, emailAddress,
        permanentAddress, permanentCityId, permanentPostCode, nationalIdTypeId, nationalIdNo,
        nationalityId, religionId, bloodTypeId, fatherName, motherName, spouseName, contactName,
        contactAddress, contactCityId, contactPhoneNo, contactMobileNo, contactEmailAddress, allergy,
        payerId, payerIdNo, notes, patientOrganizationId : val.patientOrganizationId, organizationId: val.hospitalId
        }

      this.phoneNumberOne = mobileNo1;
      this.phoneNumberTwo = mobileNo2;
      this.nameHope = name;
      this.addressHope = address;
      this.birthDateFormat = dateFormatter(birthDate, true);
      this.postHope = bodyTwo;
      this.checkCountChar();
      this.openLarge(content);
    }
  }

  checkCountChar() {
    let countCharOne = this.charRemove(this.phoneNumberOne);
    let countCharTwo = this.charRemove(this.phoneNumberTwo);
    
    if(countCharOne) {
      this.flagCountOne = countCharOne.length > 8 ? true : false;
    }
    if(countCharTwo) {
      this.flagCountTwo = countCharTwo.length > 8 ? true : false;
    }
  }

  confirmSavePhoneNumber() {
    this.loadingBut = true;
    this.postHope.mobileNo1 = this.charRemove(this.phoneNumberOne);
    this.postHope.mobileNo2 = this.charRemove(this.phoneNumberTwo);
    this.postHope.channelId = channelId.FRONT_OFFICE;
    this.postHope.userId = this.user.id;
    this.postHope.source = sourceApps;
    this.postHope.userName = this.user.fullname;
    this.patientService.updatePatientComplete(this.postHope, this.patientHopeId).subscribe(
      data => {
        if(this.searchPatient === true) this.getSearchedPatient1();
        else this.getSearchedPatient2();
        this.loadingBut = false;
        Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Success',
          text: 'Edit Phone Number Success',
          showConfirmButton: false,
          timer: 3000
        })
        this.modalService.dismissAll();
      }, error => {
        this.loadingBut = false;
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: error.error.message,
          timer: 4000
        })
      }
    )
  }

  nextPage() {
    this.page += 1;
    this.keywords.offset = this.page * 10;
    this.isCanPrevPage = this.keywords.offset === 0 ? false : true;
    this.getListAccount();
  }

  prevPage() {
    this.page -= 1;
    this.keywords.offset = this.page * 10;
    this.isCanPrevPage = this.keywords.offset === 0 ? false : true;
    this.getListAccount();
  }

  async getListAccount() {
    const { searchString = '', offset = 0, limit = 10 } = this.keywords;

    this.accountList = await this.patientService.getAccountMobile(searchString, offset, limit)
      .toPromise().then(res => {

        this.isCanNextPage = res.data.length >= 10 ? true : false;

        if (res.data.length !== 0) {
          for (let i = 0, { length } = res.data; i < length; i += 1) {
            res.data[i].birth_date = moment(res.data[i].birth_date).format('DD-MM-YYYY');
          }

          this.showNotFoundMsg = false;
          this.showWaitMsg = false;
        } else {
          this.showNotFoundMsg = true;
          this.showWaitMsg = false;
        }
        return res.data;
      }).catch(err => {
        this.showNotFoundMsg = true;
        this.showWaitMsg = false;
        return [];
      });
  }

  async choosedAccount(val) {
    this.checkData = false;
    this.flagAlert = false;
    this.patientHope = null;
    this.flagSearch = false;
    this.uploadForm.get('disclaimer').setValue(null);
    this.flagFile1 = false;

    this.selectedAccount = {
      contact_id: val.contact_id,
      name: val.name,
      birth_date: val.birth_date,
      email_address: val.email_address,
      phone_number_1: val.phone_number_1,
      phone_number_2: val.phone_number_2,
      contact_status_id: val.contact_status_id,
      mobile_status: val.mobile_status
    };
    if(this.selectedAccount.contact_status_id === contactStatus.VERIFIED
      && this.selectedAccount.mobile_status === mobileStatus.ACTIVE) {
        this.loadingBar = true;
        this.dataContact = await this.patientService.getContact(this.selectedAccount.contact_id)
          .toPromise().then(res => {
            return res.data;
          }).catch(err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err.error.message,
              timer: 4000
            })
          });
        this.editEmail = this.dataContact.email_address;
        this.dataPatientHope = await this.patientService.getPatientHopeDetail(this.dataContact.patient_hope_id)
          .toPromise().then(res => {
            this.loadingBar = false;
            return res.data;
          }).catch(err => {
            this.loadingBar = false;
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err.error.message,
              timer: 4000
            })
          });
      }
      else if(this.selectedAccount.contact_status_id === contactStatus.VERIFIED
        && this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
          this.loadingBar = true;
          this.dataContact = await this.patientService.getContact(this.selectedAccount.contact_id)
            .toPromise().then(res => {
              return res.data;
            }).catch(err => {
              Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.error.message,
                timer: 4000
              })
            });
          this.editEmail = this.dataContact.email_address;
          if(this.dataContact.disclaimer_1) {
            this.formatFileServer = this.dataContact.disclaimer_1.split('.');
            this.urlDownload = this.urlDisclaimer + this.dataContact.disclaimer_1;
            this.fileName = this.dataContact.disclaimer_1;
            if(this.formatFileServer[1] === formatFile.pdf) {
              this.formatFlag = true;
              this.getDisclaimer = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDisclaimer + this.dataContact.disclaimer_1);
            } else {
              this.formatFlag = false;
              this.getDisclaimer = this.urlDisclaimer + this.dataContact.disclaimer_1;
            }
          } else {
            this.getDisclaimer = null
          }
          this.dataPatientHope = await this.patientService.getPatientHopeDetail(this.dataContact.patient_hope_id)
            .toPromise().then(res => {
              this.loadingBar = false;
              return res.data;
            }).catch(err => {
              this.loadingBar = false;
              Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: err.error.message,
                timer: 4000
              })
            });
        }
  }

  choosedSearchPatient(val) {
    this.selectPatient = val;
  }

  charRemove(str: any) {
    if (str) {
      str = str.replace('(+62)', '0');
      str = str.replace(/_/g, '');
      str = str.replace(/ /g, '');
      str = str.replace(/ /g, '');
      str = str.substr(0, 2) == '00' ? str.substr(1) : str;
    }
    return str;
  }

  async getCollectionAlert() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  cssAlertType(alert: Alert) {
    if (!alert) {
      return;
    }

    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
