import { Component, OnInit } from "@angular/core";
import { Consent } from "../../../models/consents/consent";
import { ConsentService } from "../../../services/consent.service";

@Component({
  selector: "app-widget-vaccine-consent-list",
  templateUrl: "./widget-vaccine-consent-list.component.html",
  styleUrls: ["./widget-vaccine-consent-list.component.css"],
})
export class WidgetVaccineConsentListComponent implements OnInit {
  public consents: Consent[] = [];
  public maskBirth = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public key: any = JSON.parse(localStorage.getItem("key"));
  public patientName: string = "";
  public dob: string = "";
  public uniqueCode: string = "";
  public showWaitMsg: boolean = false;
  public showNotFoundMsg: boolean = false;
  public showDetailConsent: boolean = false;

  constructor(private consentService: ConsentService) { }

  ngOnInit() { }

  tabChange(name: string) {
    this.showNotFoundMsg = false;
    this.showWaitMsg = false
  }

  searchByCode() {
    const orgId = this.key.hospital.orgId;
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
    const orgId = this.key.hospital.orgId;
    this.showWaitMsg = true;
    this.showNotFoundMsg = false;
    this.consentService.getByNameDob(this.patientName, this.dob, orgId).subscribe(
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

  goToDetail(id: number) {
    this.showDetailConsent = true
    console.log(id)
  }
}
