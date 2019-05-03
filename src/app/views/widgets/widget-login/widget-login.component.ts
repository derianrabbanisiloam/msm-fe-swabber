import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { UserService } from '../../../services/user.service';
import { HospitalSSO } from '../../../models/hospitals/sso.hospital';
import { appInfo } from '../../../variables/common.variable';

@Component({
  selector: 'app-widget-login',
  templateUrl: './widget-login.component.html',
  styleUrls: ['./widget-login.component.css']
})
export class WidgetLoginComponent implements OnInit {
  public model: any = {};
  public loading = false;
  public returnUrl: string;
  public toggleBox = true;
  public hospitalList: HospitalSSO[];
  public isSuccessSubmit = false;
  public applicationId = appInfo.APPLICATION_ID;
  public roleId = appInfo.ROLE_ID;

  constructor(
    private hospitalService: HospitalService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getListHopital();
  }

  async getListHopital() {
    this.hospitalList = await this.hospitalService.getSSOHospital()
    .toPromise().then(res => {
      return res.data;
    });
  }

  showToggleBox(source: string) {
    if (source == 'login') {
      this.toggleBox = true;
    } else {
      this.toggleBox = false;
    }
  }

  async signup() {
    const fullname = this.model.fullnameSignup;
    const username = this.model.usernameSignup;
    const mobileNo = this.model.mobileSignup;
    const email = this.model.emailSignup;
    const password = this.model.passwordSignup;
    const hospital = this.model.hospital;
    const applicationId = this.applicationId;
    const roleId = this.roleId;

    const body = {
      username,
      password,
      fullname,
      email,
      mobileNo,
      applicationId,
      organizationId: 2,
      hospitalId: hospital.mobile_organization_id,
      axOrganizationId: hospital.ax_organization_id,
      roleId,
    };

    await this.userService.signUp(body)
    .toPromise().then(res => {
      console.log('res', res);
      // alert(res.message);
    }).catch(err => {
      // alert(err.message);
      console.log('err', err);
    });
  }

  async login() {
    this.loading = true;

    const username = this.model.username;
    const password = this.model.password;
    const applicationId = this.applicationId;

    const body = {
      username,
      password,
      applicationId,
    };

    await this.userService.signIn(body)
    .toPromise().then(res => {
      console.log('res login', res);
    }).catch(err => {
      console.log('err login', err);
    });
  }

}
