import { Component, OnInit, Input } from '@angular/core';
import { Country } from '../../../models/generals/country';
import { City } from '../../../models/generals/city';
import { ModalUtil } from '../../../utils/modal.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { General } from '../../../models/generals/general';
import { District } from '../../../models/generals/district';
import { Subdistrict } from '../../../models/generals/subdistrict';
import { GeneralService } from '../../../services/general.service';
import { PatientService } from '../../../services/patient.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { channelId, sourceApps } from '../../../variables/common.variable';
import * as moment from 'moment';
import * as $ from 'jquery';


@Component({
  selector: 'app-modal-patient-registration',
  templateUrl: './modal-patient-registration.component.html',
  styleUrls: ['./modal-patient-registration.component.css']
})
export class ModalPatientRegistrationComponent implements OnInit {

  @Input() contactInfo: any;

  public key: any = JSON.parse(localStorage.getItem('key'));
  public hospital = this.key.hospital;
  public user = this.key.user;

  public model: any = {};
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
  public listTitle: General[];
  public listReligion: General[];
  public listMarital: General[];
  public listBloodType: General[];
  public listNationalIdType: General[];
  public listCountry: Country[];
  public listPayer: any = [];

  public listCity: City[];
  public listDistrict: District[];
  public listSubdistrict: Subdistrict[];

  public alerts: Alert[] = [];

  // Input mask
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  public isButtonSave : boolean = false;

  constructor(
    private generalService: GeneralService,
    private alertService: AlertService,
    private patientService: PatientService,
    private modalUtil: ModalUtil,
    public activeModal: NgbActiveModal,
  ) { }

  async ngOnInit() {
    console.log("contactInfo", this.contactInfo);
    await this.getCity();
    await this.getNationalIdType();
    await this.getCountry();
    await this.getPayer();
    await this.getSex();
    await this.getMarital();
    await this.getTitle();
    await this.getReligion();
    await this.getBloodType();
    await this.getCollectionAlert();
    await this.getContact(this.contactInfo.contactId);
  }

  async getCity(){
    this.listCity = await this.generalService.getCity()
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return [];
    })
  }

  async getPayer(){
    this.listPayer = await this.generalService.getPayer(this.hospital.orgId)
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

  async getNationalIdType(){
    this.listNationalIdType = await this.generalService.getNationalityIdType()
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

  async getMarital(){
    this.listMarital = await this.generalService.getMaritalStatus()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getTitle(){
    this.listTitle = await this.generalService.getTitle()
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

  async getBloodType(){
    this.listBloodType = await this.generalService.getBloodType()
     .toPromise().then( res => {
       return res.data;
     }).catch( err => {
       return [];
     })
  }

  async getContact(contactId: string){

    const contact = await this.patientService.getContact(contactId)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return null;
    });

    console.log("contact", contact);

    if(contact){
      this.model.patientName = contact.name;
      this.model.address = contact.current_address;
      this.model.mobileNo1 = contact.phone_number_1;
      this.model.birth = moment(contact.birth_date).format('DD-MM-YYYY');

      if(contact.city_id){
        const idx = this.listCity.findIndex((a)=>{
          return a.city_id === contact.city_id;
        })
        
        this.model.city = (idx >= 0) ? { city_id: this.listCity[idx].city_id, name: this.listCity[idx].name } : { city_id: null, name: ''}; 
      }else{
        this.model.city = { city_id: null, name: '' };
      }

      this.model.district = contact.district_id ? { district_id : contact.district_id } : { district_id: null };
      this.model.subdistrict = contact.sub_district_id ? { sub_district_id : contact.sub_district_id } : { sub_district_id: null };

      if(contact.country_id){
        const idx = this.listCountry.findIndex((a)=>{
          return a.country_id === contact.country_id;
        })
        
        this.model.nationality = (idx >= 0) ? { country_id: this.listCountry[idx].country_id, name: this.listCountry[idx].name } : { country_id: null, name: ''}; 
      }else{
        this.model.nationality = { country_id: null, name: '' };
      }
      
      this.model.sex =  contact.gender_id ? { value: contact.gender_id } : this.model.sex;
    }else{
      this.alertService.error('Contact not found', false, 5000);
    }
  }

  close() {
    this.activeModal.close();
    this.modalUtil.changemodalSource1(true);
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

      if(this.listSubdistrict.length != 0){
        this.model.subdistrict = this.listSubdistrict[0];
      }
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

  reset() {
    this.model = {};
    this.model.sex = { value: ''};
    this.listDistrict = [];
    this.listSubdistrict = [];
  }

  checkFormCondition() {

    let valid = true;
    console.log('Checking');

    let patientName = this.model.patientName ? this.model.patientName.trim() : "";
    let address = this.model.address ? this.model.address.trim() : "";
    let homePhone = this.model.homePhone ? this.model.homePhone.trim() : "";
    let officePhone = this.model.officePhone ? this.model.officePhone.trim() : "";
    let mobileNo1 = this.model.mobileNo1 ? this.model.mobileNo1.trim() : "";
    let mobileNo2 = this.model.mobileNo2 ? this.model.mobileNo2.trim() : "";
    let contactName = this.model.contactName ? this.model.contactName.trim() : "";
    let contactMobile = this.model.contactMobile ? this.model.contactMobile.trim() : "";
    let contactPhone = this.model.contactPhone ? this.model.contactPhone.trim(): "";

    if (!patientName) { valid = false; $('.form-pr-name').addClass('form-error');
    } else {
      $('.form-pr-name').removeClass('form-error');
    }

    if (!this.model.birth) { valid = false; $('.form-pr-bdate').addClass('form-error');
    } else if (this.model.birth) {
      let paramDate = this.model.birth.split('-');
      let bod = new Date(paramDate[2] + '-' + paramDate[1] + '- ' + paramDate[0])
      let now = new Date();
      if  (now < bod) { valid = false; $('.form-pr-bdate').addClass('form-error');
      } else { $('.form-pr-bdate').removeClass('form-error'); }
    }
    if (!this.model.sex) { valid = false; $('.form-pr-sex').addClass('form-error');
    } else { $('.form-pr-sex').removeClass('form-error'); }
    // Contact Detail
    if (!address) { valid = false; $('.form-pr-address').addClass('form-error');
    } else { $('.form-pr-address').removeClass('form-error'); }
    if (!this.model.city) { valid = false; $('.form-pr-city').addClass('form-error');
    } else { $('.form-pr-city').removeClass('form-error'); }
    if (!this.model.district.district_id) { valid = false; $('.form-pr-district').addClass('form-error');
    } else { $('.form-pr-district').removeClass('form-error'); }
    if (!this.model.subdistrict.sub_district_id) { valid = false; $('.form-pr-subdistrict').addClass('form-error');
    } else { $('.form-pr-subdistrict').removeClass('form-error'); }
    if (!this.model.nationality) { valid = false; $('.form-pr-nationality').addClass('form-error');
    } else { $('.form-pr-nationality').removeClass('form-error'); }
    if (!homePhone && !officePhone && !mobileNo1 && !mobileNo2) {
      valid = false
      $('.form-pr-homeno').addClass('form-error');
      $('.form-pr-officeno').addClass('form-error');
      $('.form-pr-mobile1no').addClass('form-error');
      $('.form-pr-mobile2no').addClass('form-error');
    } else {
      $('.form-pr-homeno input').attr('placeholder', '(Optional)');
      $('.form-pr-homeno').removeClass('form-error');
      $('.form-pr-officeno input').attr('placeholder', '(Optional)');
      $('.form-pr-officeno').removeClass('form-error');
      $('.form-pr-mobile1no input').attr('placeholder', '(Optional)');
      $('.form-pr-mobile1no').removeClass('form-error');
      $('.form-pr-mobile2no input').attr('placeholder', '(Optional)');
      $('.form-pr-mobile2no').removeClass('form-error');
    }
    if (
      (!address ||
      !this.model.city ||
      !this.model.district.district_id ||
      !this.model.subdistrict.sub_district_id ||
      !this.model.nationality) ||
      (!homePhone && !officePhone && !mobileNo1 && !mobileNo2)
    ) {
      valid = false
      $('.form-tab-contact').addClass('form-tab-error');
    } else {
      $('.form-tab-contact').removeClass('form-tab-error');
    }
    // Emergency Contact
    if (!contactName) {
      valid = false; $('.form-pr-contactname').addClass('form-error')
    }else {
      $('.form-pr-contactname').removeClass('form-error');
    }
    if (!contactMobile && !contactPhone) {
      /*valid = false; $('.form-pr-contactphoneno').addClass('form-error');
      valid = false; $('.form-pr-contactmobileno').addClass('form-error');*/
      valid = false
      $('.form-pr-contactphoneno').addClass('form-error');
      $('.form-pr-contactmobileno').addClass('form-error');

    } else {
      $('.form-pr-contactphoneno input').attr('placeholder', '(Optional)');
      $('.form-pr-contactphoneno').removeClass('form-error');
      $('.form-pr-contactmobileno input').attr('placeholder', '(Optional)');
      $('.form-pr-contactmobileno').removeClass('form-error');
    }
    if (
      !contactName ||
      (!contactMobile && !contactPhone)
    ) {
      valid = false
      $('.form-tab-emergency').addClass('form-tab-error');
    } else {
      $('.form-tab-emergency').removeClass('form-tab-error');
    }

    $('.form-error input').attr("placeholder", "");
    $('.form-error textarea').attr("placeholder", "");
    $('.form-error select').attr("placeholder", "");

    return valid;
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
      contactId: this.contactInfo.contactId,
      organizationId: Number(this.hospital.orgId),
      name: this.model.patientName,
      sexId: Number(this.model.sex.value),
      birthPlaceId: this.model.birthPlace ? this.model.birthPlace.city_id : null,
      birthDate: `${arr_birth[2]}-${arr_birth[1]}-${arr_birth[0]}`,
      titleId: this.model.title ? Number(this.model.title.value) : null,
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
      permanentCityId: this.model.permanentCity ? this.model.permanentCity.city_id : null,
      permanentPostCode: this.model.permanentPostCode ? this.model.permanentPostCode : null,
      nationalIdTypeId: this.model.nationalidType ? Number(this.model.nationalidType.value) : null,
      nationalIdNo: this.model.nationalIdNo ? this.model.nationalIdNo : null,
      nationalityId: this.model.nationality.country_id,
      religionId: this.model.religion ? Number(this.model.religion.value) : null,
      bloodTypeId: this.model.bloodType ? Number(this.model.bloodType.value) : null,
      fatherName: this.model.fatherName ? this.model.fatherName : null,
      motherName: this.model.motherName ? this.model.motherName : null,
      spouseName: this.model.spouseName ? this.model.spouseName : null,
      contactName: this.model.contactName,
      contactAddress: this.model.contactAddress ? this.model.contactAddress : null,
      contactCityId: this.model.contactCity ? this.model.contactCity.city_id : null,
      contactPhoneNo: this.model.contactPhone ? this.charRemove(this.model.contactPhone) : null,
      contactMobileNo: this.model.contactMobile ? this.charRemove(this.model.contactMobile) : null,
      contactEmailAddress: this.model.contactEmail ? this.model.contactEmail : null,
      allergy: this.model.allergy ? this.model.allergy : null,
      payerId: this.model.payer ? this.model.payer.payer_id : null,
      payerIdNo: this.model.payerIdNo ? this.model.payerIdNo : null,
      notes: this.model.notes ? this.model.notes : null,
      hospitalId: this.hospital.id,
      channelId: channelId.FRONT_OFFICE,
      userId: this.user.id,
      source: sourceApps,
      userName: this.user.fullname,
    }
    
    return payload;
  }

  async syncUpdatePatient(body: any){
    const result = await this.patientService.syncUpdatePatient(body)
    .toPromise().then( res => {
      this.alertService.success(res.message, false, 5000);
      return res.data;  
    }).catch( err => {
      this.alertService.error(err.error.message, false, 5000);
      return null;
    })

    if(result){
      this.isButtonSave = false;
      setTimeout(() => {this.close();}, 2000);
    }else{
      this.isButtonSave = false;
    }
  }

  savePatient() {
    let isValid;
    isValid = this.checkFormCondition(); // return true if valid (there is no empty mandatory)

    let x = this;
    $('.form-error').bind('input click change', function() {
      x.checkFormCondition();
    });

    if (!isValid) {
      this.alertService.error('Please input all mandatory field', false, 5000);
    }else{
      const payload = this.loadPayload();

      console.log(JSON.stringify(payload), "payload");

      this.syncUpdatePatient(payload);
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
