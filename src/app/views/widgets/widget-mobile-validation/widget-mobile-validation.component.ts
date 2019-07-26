import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { GeneralService } from '../../../services/general.service';
import { AccountMobile } from '../../../models/patients/account-mobile';
import { City } from '../../../models/generals/city';
import { District } from '../../../models/generals/district';
import { Subdistrict } from '../../../models/generals/subdistrict';
import { General } from '../../../models/generals/general';
import { Country } from '../../../models/generals/country';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { 
  ModalPatientRegistrationComponent 
} from '../modal-patient-registration/modal-patient-registration.component';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import * as moment from 'moment';

@Component({
  selector: 'app-widget-mobile-validation',
  templateUrl: './widget-mobile-validation.component.html',
  styleUrls: ['./widget-mobile-validation.component.css']
})
export class WidgetMobileValidationComponent implements OnInit {
  
  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public accountList: AccountMobile[];
  public keywords = { offset: 0, limit: 10, searchString: ''};

  private page: number = 0;
  public isCanPrevPage: boolean = false;
  public isCanNextPage: boolean = false;

  public selectedAccount: any;
  public patientList: any;
  public suggestionList: any;
  public isFound: boolean = false;
  public currentPatientHope: any;

  public mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public model: any = {};
  public params: any = { name: '', birth: '' };
  public detailPatient: any;

  public listCity: City[];
  public listDistrict: District[];
  public listSubdistrict: Subdistrict[];
  public listSex: General[] = [
    {
      description: 'Male',
      value: '1',
    },
    {
      description: 'Female',
      value: '2',
    },
  ];
  public listMarital: General[];
  public listCountry: Country[];
  public listReligion: General[];
  public listNationalIdType: General[];

  public listCheckBox = [
    { label: 'Data diri yang dimasukkan sudah sama dengan data KTP', state: false },
    { label: 'KTP adalah KTP Pasien', state: false},
    { label: 'Email adalah email pasien', state: false}
  ];

  public buttonVerify: boolean = true;
  public buttonPrint: boolean = true;

  public closeResult: string;

  public alerts: Alert[] = [];

  public showNotFoundMsgSrc: boolean = false;
  public showWaitMsgSrc: boolean = true;
  public showNotFoundMsg: boolean = false;
  public showWaitMsg: boolean = true;

  constructor(
    private patientService: PatientService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.getListAccount();
    this.getCity();
    this.getSex();
    this.getMarital();
    this.getCountry();
    this.getReligion();
    this.getNationalIdType();
    this.getCollectionAlert();
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

  async getNationalIdType(){
    this.listNationalIdType = await this.generalService.getNationalityIdType()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getReligion(){
    this.listReligion = await this.generalService.getReligion()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getCountry(){
    this.listCountry = await this.generalService.getCountry()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getMarital(){
    this.listMarital = await this.generalService.getMaritalStatus()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getSex(){
    this.listSex = await this.generalService.getGender()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getCity(){
    this.listCity = await this.generalService.getCity()
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    })
  }

  async getListAccount(){
    const { searchString = '', offset = 0, limit = 10 } = this.keywords;
    
    this.accountList = await this.patientService.getAccountMobile(searchString, offset, limit)
    .toPromise().then( res => {

      this.isCanNextPage = res.data.length >= 10 ? true: false;

      if(res.data.length !== 0){
        for (let i = 0, { length } = res.data; i < length; i += 1) {
          res.data[i].birth_date = moment(res.data[i].birth_date).format('DD-MM-YYYY');
        }

        this.showNotFoundMsg = false;
        this.showWaitMsg = false;
      }else{
        this.showNotFoundMsg = true;
        this.showWaitMsg = false;
      }
      return res.data;
    }).catch( err => {
      this.showNotFoundMsg = true;
      this.showWaitMsg = false;
      return [];
    });
  }

  choosedAccount(val){
    this.selectedAccount = val;
    this.getPatientHope();
  }

  async getPatientHope(){
    const arrBirth = this.selectedAccount.birth_date.split('-');
    const birth = `${arrBirth[2]}-${arrBirth[1]}-${arrBirth[0]}`;
    const name = this.selectedAccount.name; 
    
    this.patientList = await this.patientService.searchPatient(name, birth, this.hospital.orgId)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    });

    if(this.patientList.length != 0){
      for(let i = 0, { length } = this.patientList; i < length; i += 1){
        this.patientList[i].birthDate = moment(this.patientList[i].birthDate).format('DD-MM-YYYY');
      }
      this.isFound = true;
    }else{
      this.params.name = this.selectedAccount.name;
      this.params.birth = this.selectedAccount.birth_date;
      this.isFound = false;
    }
  }

  async getDetailAddress(from?: boolean) {
    this.listDistrict = [];
    this.listSubdistrict = [];

    if(from) {
      const cityId = this.model.city.city_id;
      const districtId = this.model.district.district_id;
      const subdistrictId = this.model.subdistrict.sub_district_id;

      this.listDistrict = await this.generalService.getDistrict(cityId)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return [];
      })

      if(this.listDistrict.length !== 0){
        if(!districtId) {
          this.model.district = this.listDistrict[0];
        }else{
          this.model.district = this.model.district;
        }
      }

      this.listSubdistrict = await this.generalService.getSubDistrict(this.model.district.district_id)
        .toPromise().then( res => {
          return res.data;
        }).catch( err => {
          return [];
        })

      if(this.listSubdistrict.length !== 0){
        if(!subdistrictId) {
          this.model.subdistrict = this.listSubdistrict[0];
        }else{
          this.model.subdistrict = this.model.subdistrict;
        }
      }

    }else{
      const cityId = this.model.city.city_id;
      
      this.listDistrict = await this.generalService.getDistrict(cityId)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return [];
      })
      
      if(this.listDistrict.length !== 0){
        this.model.district = this.listDistrict[0];
      }

      this.listSubdistrict = await this.generalService.getSubDistrict(this.model.district.district_id)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return [];
      })

      if(this.listSubdistrict.length !== 0){
        this.model.subdistrict = this.listSubdistrict[0];
      }
    }
  }

  async searchPatient(modal) {
    const arrBirth = this.params.birth.split('-');
    const birth = `${arrBirth[2]}-${arrBirth[1]}-${arrBirth[0]}`;
    const name = this.params.name;

    this.showWaitMsgSrc = true;
    this.showNotFoundMsgSrc = false;

    this.suggestionList = await this.patientService.searchPatient(name, birth, this.hospital.orgId)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    });

    if(this.suggestionList.length !== 0){
      for(let i = 0, { length } = this.suggestionList; i < length; i += 1){
        this.suggestionList[i].isThisOrg = (Number(this.hospital.orgId) === this.suggestionList[i].organizationId) ? true : false;
        this.suggestionList[i].birthDate = moment(this.suggestionList[i].birthDate).format('DD-MM-YYYY');
      }
      this.showWaitMsgSrc = false;
      this.showNotFoundMsgSrc = false;
    }else{
      this.showWaitMsgSrc = false;
      this.showNotFoundMsgSrc = true;
    }

    this.openModal70(modal);
  }

  async choosedPatient(val){
    this.currentPatientHope = val.patientOrganizationId;
    this.detailPatient = val;

    let idx_sex, idx_city, idx_contact_city, idx_religion, 
      idx_bloodType, idx_nationality, idx_national_id_type, idx_birth_place, idx_title, 
      idx_marital, idx_permanent_city = -1;
      
      idx_city = val.cityId ? this.listCity.findIndex((a)=>{
        return a.city_id === val.cityId;
      }) : idx_city;

      idx_birth_place = val.birthPlaceId ? this.listCity.findIndex((a)=>{
        return a.city_id === val.birthPlaceId;
      }) : idx_birth_place;

      idx_sex = val.sexId ? this.listSex.findIndex((a)=>{
        return Number(a.value) === val.sexId;
      }) : idx_sex;

      idx_marital = val.maritalStatusId ? this.listMarital.findIndex((a)=>{
        return Number(a.value) === val.maritalStatusId;
      }) : idx_marital;

      idx_nationality = val.nationalityId ? this.listCountry.findIndex((a)=>{
        return a.country_id === val.nationalityId;
      }) : idx_nationality;

      idx_religion = val.religionId ? this.listReligion.findIndex((a)=>{ 
        return Number(a.value) === val.religionId;
      }) : idx_religion;

      idx_national_id_type = val.nationalIdTypeId ? this.listNationalIdType.findIndex((a)=>{
        return Number(a.value) === val.nationalIdTypeId;
      }) : idx_national_id_type;

      this.model.patientName = val.name;
      this.model.birth = val.birthDate;
      this.model.address = val.address;
      this.model.fatherName =  val.fatherName;
      this.model.motherName = val.motherName;
      this.model.spouseName = val.spouseName;
      this.model.homePhone = val.homePhoneNo;
      this.model.officePhone = val.officePhoneNo;
      this.model.mobileNo1 = val.mobileNo1;
      this.model.mobileNo2 = val.mobileNo2;
      this.model.email = val.emailAddress;
      this.model.nationalIdNo = val.nationalIdNo;
      this.model.permanentAddress = val.permanentAddress;
      this.model.permanentCity = val.permanentCityId;
      this.model.mrCentral = val.mrNo;
      this.model.postCode = val.postCode;
      this.model.patientId = val.patientId;
      this.model.patientOrganizationId = val.patientOrganizationId;
      this.model.organizationId = val.organizationId;
      this.model.hospitalId = val.hospitalId;
      this.model.title = val.titleId;
      this.model.permanentPostCode = val.permanentPostCode;
      this.model.bloodType = val.bloodTypeId;
      this.model.contactName = val.contactName;
      this.model.contactAddress = val.contactAddress;
      this.model.contactCity = val.contactCityId;
      this.model.contactPhone = val.contactPhoneNo;
      this.model.contactMobile = val.contactMobileNo;
      this.model.contactEmail = val.contactEmailAddress;
      this.model.allergy = val.allergy;
      this.model.payer = val.payerId;
      this.model.payerIdNo = val.payerId;
      this.model.notes = val.notes;
      this.model.mrlocal = (Number(this.hospital.orgId) === val.organizationId) ? val.localMrNo : '-';

      this.model.city = (idx_city >= 0) ? this.listCity[idx_city] : '';
      this.model.birthPlace = (idx_birth_place >= 0) ? this.listCity[idx_birth_place] : '';
      this.model.sex = (idx_sex >= 0) ? this.listSex[idx_sex] : '';
      this.model.maritalStatus = (idx_marital >= 0) ? this.listMarital[idx_marital] : '';
      this.model.nationality = (idx_nationality >= 0) ? this.listCountry[idx_nationality] : '';
      this.model.religion = (idx_religion >= 0) ? this.listReligion[idx_religion] : ''; 
      this.model.nationalidType = (idx_national_id_type >= 0) ? this.listNationalIdType[idx_national_id_type] : '';
      
      if(val.districtId) {
        const district = await this.generalService.getDistrict(null, val.districtId)
        .toPromise().then( res => {
          return res.data;  
        }).catch( err => {
          return null;
        })
        
        this.model.district = district ? district : { district_id: null };   
      }else{
        this.model.district = { district_id: null };
      }

      if(val.subDistrictId) {
        const subdistrict = await this.generalService.getSubDistrict(null, val.subDistrictId)
        .toPromise().then( res => {
          return res.data;
        }).catch( err => {
          return null;
        });
        
        this.model.subdistrict = subdistrict ? subdistrict : { sub_district_id: null };
      }else{
        this.model.subdistrict = { sub_district_id: null };
      }

      await this.getDetailAddress(true);
  }

  findSubdistrict(event: any) {
    this.listSubdistrict = [];

    const str_district = event.target.value;
    
    const idx = this.listDistrict.findIndex((a)=>{ 
      return a.name == str_district;
    })
    
    if(idx >= 0) {
      this.model.district = this.listDistrict[idx];
    }
    
    const districtId = this.model.district.district_id;

    if(districtId) {
      this.getSubdistrict(districtId);
    }
  }

  async getSubdistrict(districtId = null, subDistrictId = null){
    if(districtId){
      this.listSubdistrict = await this.generalService.getSubDistrict(districtId)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return [];
      })
    }
    
    if(subDistrictId){
      this.model.subdistrict = await this.generalService.getSubDistrict(districtId, subDistrictId)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return { sub_district_id: null };
      })
    }
  }

  selectSubdistrict(event: any) {

    const str_subdistrict = event.target.value;

    const idx = this.listSubdistrict.findIndex((a)=>{
      return a.name == str_subdistrict
    })

    if(idx >= 0) {
      this.model.subdistrict = this.listSubdistrict[idx];
    }

  }

  setButtonState(){
    let counter = 0;
    
    for(let i = 0, { length } = this.listCheckBox; i < length; i += 1){
      if(this.listCheckBox[i].state === true) {
        counter++;
      }
    }

    if(counter >= 3) {
      this.buttonVerify = false;
      this.buttonPrint = false;
    }else{
      this.buttonVerify = true;
      this.buttonPrint = true;
    }
  }

  charRemove(str: any){
    if(str){
      str = str.replace('(+62)', '0');
      str = str.replace(/_/g, '');
      str = str.replace( / /g, '');
      str = str.replace( / /g, '');
      str = str.substr(0,2) == '00' ? str.substr(1) : str;
    }
    return str;
  }

  loadPayload(){
    const arr_birth = this.model.birth.split('-');

    const payload = {
      organizationId: Number(this.model.organizationId),
      name: this.model.patientName,
      sexId: this.model.sex ? Number(this.model.sex.value) : null,
      birthPlaceId: this.model.birthPlace ? this.model.birthPlace.city_id : null,
      birthDate: `${arr_birth[2]}-${arr_birth[1]}-${arr_birth[0]}`,
      titleId: this.model.title ? Number(this.model.title) : null,
      maritalStatusId: this.model.maritalStatus ? Number(this.model.maritalStatus.value) : null,
      address: this.model.address,
      cityId: this.model.city.city_id,
      districtId: this.model.district.district_id,
      subDistrictId: this.model.subdistrict.sub_district_id,
      postCode: this.model.postCode ? this.model.postCode : null,
      homePhoneNo: this.model.homePhone ? this.charRemove(this.model.homePhone) : null,
      officePhoneNo: this.model.officePhone ? this.charRemove(this.model.officePhone) : null,
      mobileNo1: this.model.mobileNo1 ? this.charRemove(this.model.mobileNo1) : null,
      mobileNo2: this.model.mobileNo2 ? this.charRemove(this.model.mobileNo2) : null,
      emailAddress: this.model.email ? this.model.email : '',
      permanentAddress: this.model.permanentAddress ? this.model.permanentAddress : null,
      permanentCityId: this.model.permanentCity ? this.model.permanentCity : null,
      permanentPostCode: this.model.permanentPostCode ? this.model.permanentPostCode : null,
      nationalIdTypeId: this.model.nationalidType ? Number(this.model.nationalidType.value) : null,
      nationalIdNo: this.model.nationalIdNo ? this.model.nationalIdNo : null,
      nationalityId: this.model.nationality ? this.model.nationality.country_id : null,
      religionId: this.model.religion ? Number(this.model.religion.value) : null,
      bloodTypeId: this.model.bloodType ? Number(this.model.bloodType.value) : null,
      fatherName: this.model.fatherName ? this.model.fatherName : null,
      motherName: this.model.motherName ? this.model.motherName : null,
      spouseName: this.model.spouseName ? this.model.spouseName : null,
      contactName: this.model.contactName,
      contactAddress: this.model.contactAddress ? this.model.contactAddress : null,
      contactCityId: this.model.contactCity,
      contactPhoneNo: this.model.contactPhone ? this.charRemove(this.model.contactPhone) : null,
      contactMobileNo: this.model.contactMobile ? this.charRemove(this.model.contactMobile) : null,
      contactEmailAddress: this.model.contactEmail ? this.model.contactEmail : null,
      allergy: this.model.allergy ? this.model.allergy : null,
      payerId: this.model.payer,
      payerIdNo: this.model.payerIdNo ? this.model.payerIdNo : null,
      notes: this.model.notes ? this.model.notes : null,
      hospitalId: this.model.hospitalId,
      channelId: channelId.FRONT_OFFICE,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    }

    return payload;
  }

  async updatePatientComplete(body: any, params: any){
    const result = await this.patientService.updatePatientComplete(body, params)
    .toPromise().then( res => {
      this.alertService.success(res.message, false, 5000);
      return res.data;  
    }).catch( err => {
      this.alertService.error(err.error.message, false, 5000);
      return null;
    })

    return result;
  }

  verify(modal){
    this.openconfirmation(modal);
  }

  async accountVerify(body: any){
    const result = await this.patientService.accountVerify(body)
    .toPromise().then( res => {
      this.alertService.success(res.message, false, 5000);
      return res.data;  
    }).catch( err => {
      this.alertService.error(err.error.message, false, 5000);
      return null;
    })
  }

  async verifyProcess(){
    //update hope and mysiloam
    const payload = this.loadPayload();

    if(this.model.patientId && this.model.patientOrganizationId){
      const body = {
        ...payload,
        patientOrganizationId: this.model.patientOrganizationId,
      };
      const result = await this.updatePatientComplete(body, this.model.patientId);

      if(result){
        const params = {
          contactId: this.selectedAccount.contact_id,
          userId: this.user.id,
          source: sourceApps,
          userName: this.user.fullname,
        };
        await this.accountVerify(params);
      }
    }

  }

  openPatientRegistration(){

    const data = {
      contactId: this.selectedAccount.contact_id,
    };
    
    const modalRef = this.modalService.open(ModalPatientRegistrationComponent, {windowClass: 'fo_modal_70'});

    modalRef.componentInstance.contactInfo = data;
  }

  openconfirmation(content) {
    this.modalService.open(content, {windowClass: 'fo_modal_confirmation'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal70(content) {
    this.modalService.open(content, {windowClass: 'fo_modal_70'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
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
