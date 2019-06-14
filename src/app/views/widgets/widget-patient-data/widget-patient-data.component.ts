import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Country } from '../../../models/generals/country';
import { City } from '../../../models/generals/city';
import { General } from '../../../models/generals/general';
import { District } from '../../../models/generals/district';
import { Subdistrict } from '../../../models/generals/subdistrict';
import { GeneralService } from '../../../services/general.service';
import { PatientService } from '../../../services/patient.service';
import { AppointmentService } from '../../../services/appointment.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
import { dateFormatter } from '../../../utils/helpers.util';
import { channelId, sourceApps } from '../../../variables/common.variable';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as $ from 'jquery';

@Component({
  selector: 'app-widget-patient-data',
  templateUrl: './widget-patient-data.component.html',
  styleUrls: ['./widget-patient-data.component.css']
})
export class WidgetPatientDataComponent implements OnInit {
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

  public appointmentId: any;
  public selectedCheckIn: any;

  public isFromAppointmentList: boolean = false;

  // Flag is success or not while save patient and admission
  public isSuccessCreatePatient: boolean = false;
  public isSuccessCreateAdmission: boolean = false;
  public isLoadingCreateAdmission: boolean = false;
  public isButtonSave : boolean = false;

  public listActiveAdmission: any;

  public showWaitMsg: boolean = true;
  public showNotFoundMsg: boolean = false;
  
  // Input mask
  public mask_birth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  public alerts: Alert[] = [];
  public closeResult: string;

  public listSuggestionPatient: any;
  public listInputUser: any = [];
  public contactDetail: any;

  constructor(
    private generalService: GeneralService,
    private alertService: AlertService,
    private patientService: PatientService,
    private modalService: NgbModal,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.model.sex = { value: '1' };
    this.model.CentralRegDate = dateFormatter(new Date(), true);
    this.model.registerDate = this.model.CentralRegDate;

    this.model.district = { district_id: null };
    this.model.subdistrict = { sub_district_id: null };
  }

  ngOnInit() {
    this.getCity();
    this.isAppointment();
    this.getNationalIdType();
    this.getCountry();
    this.getPayer();
    this.getSex();
    this.getMarital();
    this.getTitle();
    this.getReligion();
    this.getBloodType();
    this.getCollectionAlert();
  }

  async isAppointment(){
    this.appointmentId = this.route.snapshot.queryParams['appointmentId'];

    if(this.appointmentId){
      this.isFromAppointmentList = true;

      const appointment = await this.appointmentService.getAppointmentById(this.appointmentId)
      .toPromise().then( res => {
        return res.data[0];
      }).catch( err => {
        return null;
      });

      if(appointment){
        this.selectedCheckIn = appointment;
        this.getContact(this.selectedCheckIn.contact_id);
      }else{
        this.alertService.error('Appointment not found', false, 5000);
      }
    }

    console.log("selectedCheckIn", this.selectedCheckIn);
  }

  async getContact(contactId: string){

    const contact = await this.patientService.getContact(contactId)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      return null;
    });

    if(contact){
      this.contactDetail = contact;
      this.model.patientName = contact.name;
      this.model.address = contact.current_address;
      this.model.mobileNo1 = contact.phone_number_1;
      this.model.birth = dateFormatter(contact.birth_date, true);

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

  async getDetailAddress(from?: boolean) {
    this.listDistrict = []
    this.listSubdistrict = []
    this.listSubdistrict = []

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

  async getDistrict(cityId = null, districtId = null){
    if(cityId){
      this.listDistrict = await this.generalService.getDistrict(cityId)
      .toPromise().then( res => {
        return res.data;
      }).catch( err => {
        return [];
      })
    }
    
    if(districtId){
      this.model.district = await this.generalService.getDistrict(cityId, districtId).toPromise()
      .then( res => {
        return res.data;
      }).catch( err => {
        return { district_id: null };
      })
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

  selectSubdistrict(event: any) {

    const str_subdistrict = event.target.value;

    const idx = this.listSubdistrict.findIndex((a)=>{
      return a.name == str_subdistrict
    })

    if(idx >= 0) {
      this.model.subdistrict = this.listSubdistrict[idx];
    }

  }

  async actionSearch(name: any, birth: any){
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    
    const suggestion = await this.patientService.searchPatient(this.hospital.orgId, name, birth)
    .toPromise().then( res => {
      return res.data;
    }).catch( err => {
      this.showNotFoundMsg = true;
      this.showWaitMsg = false;
      return [];
    })

    if(suggestion.length !== 0){
      let idx_sex, idx_city, idx_contact_city, idx_religion, 
      idx_bloodType, idx_nationality, idx_national_id_type, idx_birth_plcae, idx_title, 
      idx_marital, idx_permanent_city = -1;

      for(var i = 0; i < suggestion.length; i++) {
        idx_religion = suggestion[i].religionId ? this.listReligion.findIndex((a)=>{ 
          return Number(a.value) === suggestion[i].religionId;
        }) : idx_religion;

        idx_sex = suggestion[i].sexId ? this.listSex.findIndex((a)=>{
          return Number(a.value) === suggestion[i].sexId;
        }) : idx_sex;
        
        idx_bloodType = suggestion[i].bloodTypeId ? this.listBloodType.findIndex((a)=>{
          return Number(a.value) === suggestion[i].bloodTypeId;
        }) : idx_bloodType;

        idx_nationality = suggestion[i].nationalityId ? this.listCountry.findIndex((a)=>{
          return a.country_id === suggestion[i].nationalityId;
        }) : idx_nationality;
        
        idx_city = suggestion[i].cityId ? this.listCity.findIndex((a)=>{
          return a.city_id === suggestion[i].cityId;
        }) : idx_city; 

        idx_contact_city = suggestion[i].contactCityId ? this.listCity.findIndex((a)=>{
          return a.city_id === suggestion[i].contactCityId;
        }) : idx_contact_city;
        
        idx_permanent_city = suggestion[i].permanentCityId ? this.listCity.findIndex((a)=>{
          return a.city_id === suggestion[i].permanentCityId;
        }) : idx_permanent_city; 

        idx_birth_plcae = suggestion[i].birthPlaceId ? this.listCity.findIndex((a)=>{
          return a.city_id === suggestion[i].birthPlaceId;
        }) : idx_birth_plcae;
        
        idx_title = suggestion[i].titleId ? this.listTitle.findIndex((a)=>{
          return Number(a.value) === suggestion[i].titleId;
        }) : idx_title;

        idx_marital = suggestion[i].maritalStatusId ? this.listMarital.findIndex((a)=>{
          return Number(a.value) === suggestion[i].maritalStatusId;
        }) : idx_marital;
        
        idx_national_id_type = suggestion[i].nationalIdTypeId ? this.listNationalIdType.findIndex((a)=>{
          return Number(a.value) === suggestion[i].nationalIdTypeId;
        }) : idx_national_id_type;

        suggestion[i].viewedBirthDate = suggestion[i].birthDate ? dateFormatter(suggestion[i].birthDate, true) : '';
        suggestion[i].str_religion = (idx_religion >= 0) ? this.listReligion[idx_religion] : '';
        suggestion[i].str_sex = (idx_sex >= 0) ? this.listSex[idx_sex] : '';
        suggestion[i].str_bloodType = (idx_bloodType >= 0) ? this.listBloodType[idx_bloodType] : '';
        suggestion[i].str_nationality = (idx_nationality >= 0) ? this.listCountry[idx_nationality] : '';
        suggestion[i].str_city = (idx_city >= 0) ? this.listCity[idx_city] : '';
        suggestion[i].str_contact_city = (idx_contact_city >= 0) ? this.listCity[idx_contact_city] : '';
        suggestion[i].str_permanent_city = (idx_permanent_city >= 0) ? this.listCity[idx_permanent_city] : '';
        suggestion[i].str_birth_place = (idx_birth_plcae >= 0) ? this.listCity[idx_birth_plcae] : '';
        suggestion[i].str_title = (idx_title >= 0) ? this.listTitle[idx_title] : '';
        suggestion[i].str_marital = (idx_marital >= 0) ? this.listMarital[idx_marital] : '';
        suggestion[i].str_national_id_type = (idx_national_id_type >= 0) ? this.listNationalIdType[idx_national_id_type] : '';
      }
      
      this.listSuggestionPatient = suggestion;
      this.showWaitMsg = false;
      console.log("suggesstion", this.listSuggestionPatient);
    }else{
      this.showNotFoundMsg = true;
      this.showWaitMsg = false;
    }
  }

  searchPatient(name: any, birth: any){
    this.listInputUser = [];
    this.listSuggestionPatient = [];

    const arr_birth = birth.split('-');
    const birthDate = `${arr_birth[2]}-${arr_birth[1]}-${arr_birth[0]}`;
    this.model.viewedBirthDate = birth;
    this.listInputUser.push(this.model);

    this.actionSearch(name, birthDate);
  }

  findMatchPatient(content) {
    if(!this.model.patientName || !this.model.birth) {
      if(!this.model.patientName) {
        this.alertService.error('Please input patient name', false, 5000);
      }
      if(!this.model.birth) {
        this.alertService.error('Please input patient birthdate', false, 5000);
      }
    }else{
      this.searchPatient(this.model.patientName, this.model.birth);
      this.openLarge(content);
    }
  }

  async choosePatient(val, isFromHope) {
    this.model.viewedBirthDate = null;
    this.listInputUser = [];

    if(isFromHope) {
      this.model.patientId = val.patientId;
      this.model.patientOrganizationId = val.patientOrganizationId;
      this.model.createDate = val.createDate;
      this.model.registrationDate = val.registrationDate;
      this.model.mrCentral = val.mrNo;
      this.model.mrlocal = val.localMrNo;
      this.model.birth = val.viewedBirthDate;
      this.model.patientName = val.name;
      this.model.fatherName =  val.fatherName;
      this.model.motherName = val.motherName;
      this.model.spouseName = val.spouseName;
      this.model.birthPlace = val.str_birth_place;
      this.model.title = val.str_title;
      this.model.bloodType = val.str_bloodType;
      this.model.sex = val.str_sex;
      this.model.religion = val.str_religion;
      this.model.address = val.address;
      this.model.city = val.str_city;

      if(val.districtId) {
        const district = await this.generalService.getDistrict(null, val.districtId)
        .toPromise().then( res => {
          return res.data;  
        }).catch( err => {
          return null;
        })
        
        this.model.district = district ? district : { district_id: null };   
        console.log("this.model.district", this.model.district);
      }else{
        this.model.district = { district_id: null };
      }

      if(val.subDistrictId) {
        console.log(val.subDistrictId, "val.subDistrictId");
        
        const subdistrict = await this.generalService.getSubDistrict(null, val.subDistrictId)
        .toPromise().then( res => {
          console.log("res.data", res.data)
          return res.data;
        }).catch( err => {
          return null;
        });
        
        this.model.subdistrict = subdistrict ? subdistrict : { sub_district_id: null };

        console.log("this.model.subdistrict", this.model.subdistrict)
      }else{
        this.model.subdistrict = { sub_district_id: null };
      }
      
      await this.getDetailAddress(true);

      this.model.postCode = val.postCode;
      this.model.maritalStatus = val.str_marital;
      this.model.notes = val.notes;
      this.model.allergy = val.allergy;

      this.model.homePhone = val.homePhoneNo;
      this.model.officePhone = val.officePhoneNo;
      this.model.mobileNo1 = val.mobileNo1;
      this.model.mobileNo2 = val.mobileNo2;
      this.model.email = val.emailAddress;

      this.model.contactEmail = val.contactEmailAddress;
      this.model.contactMobile = val.contactMobileNo;
      this.model.contactAddress = val.contactAddress;
      this.model.contactPhone = val.contactPhoneNo;
      this.model.contactName = val.contactName;
      this.model.contactCity = val.str_contact_city;

      this.model.nationality = val.str_nationality;
      console.log("cek national 1", val.str_nationality);
      this.model.nationalidType = val.str_national_id_type;
      console.log("cek national 2", val.str_national_id_type);
      this.model.nationalIdNo = val.nationalIdNo;
      console.log("cek national 3", val.nationalIdNo);

      this.model.permanentPostCode = val.permanentPostCode;
      this.model.permanentAddress = val.permanentAddress;
      this.model.permanentCity = val.str_permanent_city;
      this.model.payerIdNo = val.payerIdNo;
    }
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
      /*valid = false; $('.form-pr-homeno').addClass('form-error');
      valid = false; $('.form-pr-officeno').addClass('form-error');
      valid = false; $('.form-pr-mobile1no').addClass('form-error');
      valid = false; $('.form-pr-mobile2no').addClass('form-error');*/

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

  loadPayload(){
    const arr_birth = this.model.birth.split('-');

    const payload = {
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

  async createPatientComplete(body: any){
    const result = await this.patientService.createPatientComplete(body)
    .toPromise().then( res => {
      this.alertService.success(res.message, false, 5000);
      return res.data;  
    }).catch( err => {
      this.alertService.error(err.error.message, false, 5000);
      return null;
    })

    if(result){
      this.model.mrlocal = result.medical_record_number;
      this.model.patientOrganizationId = result.patient_organization_id;
    }
  }


  savePatient() {
    let isValid;
    isValid = this.checkFormCondition(); // return true if valid (there is no empty mandatory)

    console.log("isValid", isValid)

    let x = this;
    $('.form-error').bind('input click change', function() {
      console.log('Checking');
      x.checkFormCondition();
    });

    if (!isValid) {
      this.alertService.error('Please input all mandatory field', false, 5000);
    }else{
      const payload = this.loadPayload();

      if(this.isFromAppointmentList){

      }else{
        this.createPatientComplete(payload);
      }
    }  
  }

  openLarge(content) {
    this.modalService.open(content, {windowClass: 'fo_modal_search'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  printForm() {

  }

  reset() {
    this.model = {};
    this.listDistrict = [];
    this.listSubdistrict = [];
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
