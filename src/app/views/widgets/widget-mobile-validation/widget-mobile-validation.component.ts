import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { GeneralService } from '../../../services/general.service';
import { AccountMobile } from '../../../models/patients/account-mobile';
import { sourceApps, mobileStatus, contactStatus } from '../../../variables/common.variable';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-widget-mobile-validation',
  templateUrl: './widget-mobile-validation.component.html',
  styleUrls: ['./widget-mobile-validation.component.css']
})
export class WidgetMobileValidationComponent implements OnInit {
  public assetPath = environment.ASSET_PATH;
  public urlKtp = environment.GET_IMAGE_KTP;
  public getKtp;
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
  public flagFile2: boolean = false;
  public validUpload1: boolean = false;
  public validUpload2: boolean = false;
  public flagEmail: boolean = false;
  public loadingBar: boolean = false;
  public loadingBarTwo: boolean = false;

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
  public assetKtp: any;
  public assetDisclaimer: any;
  public formPrint;
  uploadForm: FormGroup;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {
    this.formPrint = [
      {header: 'Name'},
      {header: 'Date of Birth'},
      {header: 'No. MR Central'},
      {header: 'Mobile Number'},
      {header: 'Email'}];
   }

  ngOnInit() {
    this.getListAccount();
    this.getCollectionAlert();
    this.uploadForm = this.formBuilder.group({
      disclaimer: [''],
      ktp: ['']
    });
  }

  onPrint(){
    window.print();
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="document.execCommand('print');window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

  deleteDisclaimer() {
    this.uploadForm.get('disclaimer').setValue(null);
    this.flagFile1 = false;
  }

  deleteKtp() {
    this.uploadForm.get('ktp').setValue(null);
    this.flagFile2 = false;
  }
  
  uploadDisclaimer(event){
    if (event.target.files.length > 0) {
      this.flagFile1 = true;
      const file = event.target.files[0];
      this.uploadForm.get('disclaimer').setValue(file);
    }
  }

  uploadKtp(event){
    if (event.target.files.length > 0) {
      this.flagFile2 = true;
      const file = event.target.files[0];
      this.uploadForm.get('ktp').setValue(file);
    }
  }

  async onSubmitUpload() {
    const formData_1 = new FormData();
    const formData_2 = new FormData();
    formData_1.append('uploader', 'disclaimer_1');
    formData_1.append('filePdf', this.uploadForm.get('disclaimer').value);
    formData_2.append('uploader', 'identity');
    formData_2.append('filePdf', this.uploadForm.get('ktp').value);

    if(this.dataContact.email_address) {
      this.assetDisclaimer = await this.patientService.uploadImage(formData_1)
      .toPromise().then(res => {
        return res.data;
      }).catch(err => {
        this.alertService.error(err.error.message, false, 5000);
      });

    if(this.selectedAccount.mobile_status !== mobileStatus.ACCESSED) {
      this.assetKtp = await this.patientService.uploadImage(formData_2)
        .toPromise().then(res => {
          return res.data;
        }).catch(err => {
          this.alertService.error(err.error.message, false, 5000);
        });
        await this.editDataContact(this.assetDisclaimer.name);
        await this.editContactUpload(this.assetDisclaimer.name, this.assetKtp.name);
      }
      else if (this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
        this.editDataContact(this.assetDisclaimer.name);
      }
    }
  }

  async editContactUpload(disclaimer, ktp) {
    let body;
    body = {
      disclaimer: disclaimer,
      contactId: this.dataContact.contact_id,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.username
    }
    ktp ? body.identity = ktp : '';
    this.patientService.uploadContact(body).subscribe(
      data => {
        this.assetKtp = null;
        this.assetDisclaimer = null;
        this.flagFile1 = false;
        this.flagFile2 = false;
        this.uploadForm.get('disclaimer').setValue(null);
        this.uploadForm.get('ktp').setValue(null);
        this.alertService.success('Upload Data Success', false, 5000);
        this.getListAccount();
        this.selectedAccount.contact_status_id = contactStatus.VERIFIED;
        this.selectedAccount.mobile_status = mobileStatus.ACCESSED;
        this.choosedAccount(this.selectedAccount);
      }, error => {
        this.alertService.error(error.error.message, false, 5000);
      }
    )
  }

  openConfirmationModal(modal: any) {
    this.modalService.open(modal);
  }

  async verifyPatient() {
    this.activeModal.close();
    const payload = {
      patientHopeId: this.selectPatient.patientId,
      contactId: this.selectedAccount.contact_id,
      hospitalId: this.hospital.id,
      userId: this.user.id,
      source: sourceApps
    };
    this.patientService.verifyPatient(payload).subscribe(
      data => {
        this.alertService.success('Verify Patient Success', false, 5000);
        this.getListAccount();
        this.selectedAccount.contact_status_id = contactStatus.VERIFIED;
        this.selectedAccount.mobile_status = mobileStatus.ACTIVE;
        this.choosedAccount(this.selectedAccount);
      }, error => {
        this.alertService.error(error.error.message, false, 5000);
      }
    )

  }

  editDataContact(disclaimer){
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
    } else if(this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
      this.editContactPayload = {
        contactId: this.dataContact.contact_id,
        data: {
          disclaimer1: disclaimer
        },
        userId: this.user.id,
        userName: this.user.username,
        source: sourceApps
      };
      this.editEmail !== this.dataContact.email_address ? 
      this.editContactPayload.data.emailAddress = this.dataContact.email_address : '';
    }

    this.patientService.updateContact(this.selectedAccount.contact_id, this.editContactPayload).subscribe(
      data => {
        this.getListAccount();
        this.flagFile1 = false;
        this.uploadForm.get('disclaimer').setValue(null);
        this.alertService.success('Edit Success', false, 5000);
      }, error => {
        this.alertService.error(error.error.message, false, 5000);
      }
    )
  }

  getSearchedPatient1() {
    this.flagSearch = false;
    this.loadingBarTwo = true;
    let dateBirth = moment(this.selectedAccount.birth_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    this.patientService.searchPatientAccessMr(this.selectedAccount.name, dateBirth).subscribe(
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
        this.alertService.error(error.error.message, false, 5000);
      }
    )
  }

  getSearchedPatient2() {
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
        this.alertService.error(error.error.message, false, 5000);
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
    //this.selectedAccount = val;
    this.patientHope = null;
    this.flagSearch = false;
    this.uploadForm.get('disclaimer').setValue(null);
    this.flagFile1 = false;
    this.uploadForm.get('ktp').setValue(null);
    this.flagFile2 = false;

    this.selectedAccount = {
      contact_id: val.contact_id,
      name: val.name,
      birth_date: val.birth_date,
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
            this.alertService.error(err.error.message, false, 5000);
          });
        this.editEmail = this.dataContact.email_address;
        this.dataPatientHope = await this.patientService.getPatientHopeDetail(this.dataContact.patient_hope_id)
          .toPromise().then(res => {
            this.loadingBar = false;
            return res.data;
          }).catch(err => {
            this.loadingBar = false;
            this.alertService.error(err.error.message, false, 5000);
          });
      }
      else if(this.selectedAccount.contact_status_id === contactStatus.VERIFIED
        && this.selectedAccount.mobile_status === mobileStatus.ACCESSED) {
          this.loadingBar = true;
          this.dataContact = await this.patientService.getContact(this.selectedAccount.contact_id)
            .toPromise().then(res => {
              return res.data;
            }).catch(err => {
              this.alertService.error(err.error.message, false, 5000);
            });
          this.editEmail = this.dataContact.email_address;
          this.getKtp = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlKtp + this.dataContact.identity);
          this.dataPatientHope = await this.patientService.getPatientHopeDetail(this.dataContact.patient_hope_id)
            .toPromise().then(res => {
              this.loadingBar = false;
              return res.data;
            }).catch(err => {
              this.loadingBar = false;
              this.alertService.error(err.error.message, false, 5000);
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

}
