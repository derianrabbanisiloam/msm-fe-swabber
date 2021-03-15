import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PayerService } from '../../../services/payer.service';

@Component({
  selector: 'app-modal-search-payer',
  templateUrl: './modal-search-payer.component.html',
  styleUrls: ['./modal-search-payer.component.css']
})
export class ModalSearchPayerComponent implements OnInit {

  @Input() params: any;
  public listReferralSource: any = [];
  public listDiagnose: any = []
  public keyword: string = '';
  public searchLoader: boolean = false;
  public title: string = '';
  public isReferralModal: boolean = true;

  constructor(
    private payerService: PayerService,
    public activeModal: NgbActiveModal,
    public ngbProgressbarConfig: NgbProgressbarConfig
  ) { 
    this.ngbProgressbarConfig.max = 1000;
    this.ngbProgressbarConfig.striped = true;
    this.ngbProgressbarConfig.animated = true;
    this.ngbProgressbarConfig.type = 'success';
    this.ngbProgressbarConfig.height = '20px';
  }

  ngOnInit() {
    this.setTitle();
  }

 async setTitle(){
    if (this.params.from == 'referralSource'){
      this.title = 'PROVIDER REFERENCE'
      await this.getReferralSource()
      this.isReferralModal = true;
    } else {
      this.title = 'DIAGNOSIS REFERENCE'
      await this.getDiagnose()
      this.isReferralModal = false;
    }
  }

  async getDiagnose(){
    this.searchLoader = true;
    let payload = {
      patientId: this.params.patientId,
      keyword: this.keyword || ''
    }
    this.listDiagnose = await this.payerService.getDeaseClasification(payload)
    .toPromise().then(
      res => {
        this.searchLoader = false
        return res.data
      }
    )
    .catch(err => {
      this.searchLoader = false
      return []
    })
  }
  async getReferralSource(){
    this.searchLoader = true;
    let payload = {
        payerId: this.params.payerId,
        organizationId: this.params.organizationId,
        keyword: this.keyword || ''
    }
    this.listReferralSource = await this.payerService.getListRefferal(payload)
    .toPromise().then(res => {
      this.searchLoader = false
      return res.data
    }).catch(err => {
      this.searchLoader = false
      return []
    })
  }

  searchReference(){
    if (this.isReferralModal){
      this.getReferralSource()
    } else {
      this.getDiagnose()
    }
  }

  chooseDiagnose(data){
    this.payerService.changeDiagnose(data)
  }

  chooseReferral(data){
     this.payerService.changeReferralSource(data)
  }

  close(){
    this.activeModal.close()
  }
}
