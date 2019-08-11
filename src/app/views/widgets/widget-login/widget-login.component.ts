import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../../services/hospital.service';
import { UserService } from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';
import { Alert, AlertType } from '../../../models/alerts/alert';
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

  public alerts: Alert[] = [];

  constructor(
    private hospitalService: HospitalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.userService.signOut();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.getListHopital();
    this.getCollectionAlert();
  }

  async getListHopital() {
    this.hospitalList = await this.hospitalService.getSSOHospital()
    .toPromise().then(res => {
      return res.data;
    });
  }

  showToggleBox(source: string) {
    if (source === 'login') {
      this.toggleBox = true;
    } else {
      this.toggleBox = false;
    }
    this.alerts = [];
  }

  async signup() {
    this.alerts = [];
    const fullname = this.model.fullnameSignup;
    const username = this.model.usernameSignup;
    const mobileNo = this.model.mobileSignup;
    const email = this.model.emailSignup;
    const password = this.model.passwordSignup;
    const hospital = this.model.hospital;
    const applicationId = this.applicationId;
    const roleId = this.roleId;
    
    const body = {
      userAccount: username,
      password,
      fullname,
      email,
      mobileNo,
      applicationId,
      organizationId: hospital.hope_organization_id,
      hospitalId: hospital.mobile_organization_id,
      axOrganizationId: hospital.ax_organization_id,
      roleId,
    };

    await this.userService.signUp(body)
    .toPromise().then(res => {
      this.alertService.success(res.message);
    }).catch(err => {
      this.alertService.error(err.error.message);
    });
  }

  async login() {
    this.alerts = [];
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
      if (res.status == 'OK') {

        const collections = [];

        for (let i = 0; i < res.data.length; i++) {
          collections.push({
            id: res.data[i].hospital_id,
            orgId: res.data[i].hospital_hope_id,
            name : res.data[i].name,
            alias: res.data[i].alias,
            zone: res.data[i].time_zone,
          });
        }

        const key = {
          user: {
            id: res.data[0].user_id,
            username: res.data[0].user_name,
            fullname: res.data[0].full_name,
          },
          hospital: {
            id: res.data[0].hospital_id,
            orgId: res.data[0].hospital_hope_id,
            name: res.data[0].name,
            alias: res.data[0].alias,
            zone: res.data[0].time_zone,
          },
          collection: collections,
        };

        localStorage.setItem('key', JSON.stringify(key));

        this.router.navigate([this.returnUrl]);
      } else {
        this.alertService.error(`Username or/and Password wrong`);
      }

      this.loading = false;
    }).catch(err => {
      this.loading = false;
      this.alertService.error(err.error.message);
    });
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

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

}
