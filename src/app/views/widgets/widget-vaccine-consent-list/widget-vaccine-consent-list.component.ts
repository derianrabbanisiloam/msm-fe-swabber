import * as moment from "moment";
import { Component, OnInit } from "@angular/core";
import { Consent } from "../../../models/consents/consent";
import { ConsentDetail } from "../../../models/consents/ConsentDetail";
import { ConsentService } from "../../../services/consent.service";

@Component({
  selector: "app-widget-vaccine-consent-list",
  templateUrl: "./widget-vaccine-consent-list.component.html",
  styleUrls: ["./widget-vaccine-consent-list.component.css"],
})
export class WidgetVaccineConsentListComponent implements OnInit {
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
  public showMessage: { isShow: boolean; message: string; class: string } = {
    isShow: false,
    message: "",
    class: "",
  };
  public updateStatus: string = "Initial";
  public separator: string = "<answer>";

  constructor(private consentService: ConsentService) { }

  ngOnInit() { }

  searchByCode() {
    const orgId = this.key.hospital.orgId;
    this.updateStatus = "Initial";
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
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
    this.updateStatus = "Initial";
    const orgId = this.key.hospital.orgId;
    this.consents = [];
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.consentService
      .getByNameDob(this.patientName, this.dob, orgId)
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

  goToDetail(payload: any) {
    this.updateStatus = "Initial";
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
          detail: this.consentAnswer,
        };
        console.log(this.consentInfo)
      },
      (err) => {
        this.showDetailConsent = false;
      }
    );
  }

  updateConsent() {
    this.updateStatus = "Loading";
    const orgId = this.key.hospital.orgId;
    this.consentService
      .putConsent({
        ...this.consentInfo,
        create_user: "FO",
        organization_id: orgId,
      })
      .subscribe(
        (res) => {
          this.updateStatus = "Success";
        },
        (err) => {
          this.updateStatus = "Failed";
        }
      );
  }

  fieldsChange(event: any, id: number) {
    this.updateStatus = "Initial";
    const foundIndex = this.consentInfo.detail.findIndex(
      (item) => item.consent_detail_id === id
    );
    this.consentInfo.detail[foundIndex].answer_value = event.target.value;
  }

  getAlertClass() {
    switch (this.updateStatus) {
      case "Loading":
      case "Initial":
        return "alert-none";
      case "Success":
        return "alert-success";
      case "Failed":
        return "alert-fail";
      default:
        return "alert-none";
    }
  }
}
