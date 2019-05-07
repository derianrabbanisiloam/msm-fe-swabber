import { Component, OnInit } from '@angular/core';
import { DoctorHospital } from '../../../models/doctors/doctor-hospital';
import { DoctorService } from '../../../services/doctor.service';
import { FormHandlerMessage } from '../../../models/formHandlerMessage';

@Component({
  selector: 'app-widget-view-quota',
  templateUrl: './widget-view-quota.component.html',
  styleUrls: ['./widget-view-quota.component.css']
})
export class WidgetViewQuotaComponent implements OnInit {

  public doctorHospitals: DoctorHospital = new DoctorHospital;
  public doctorQuota: DoctorHospital[];
  public formHandlerMessage: FormHandlerMessage = new FormHandlerMessage;
  public showWaitMsg = true;
  public showNotFoundMsg = false;

	public allItems: any [];
	public pager: any = {};
  public pagedItems: any [];

  public tempDoctorQuota: any = [];
  public hospitalId: any = localStorage.getItem('hospitalId');

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    this.getQuotaDoctor();
  }

  async getQuotaDoctor() {
    this.doctorQuota = await this.doctorService.getDoctorQuota(this.hospitalId)
    .toPromise().then(res => {
      if (res.status === 'OK') {
        if(res.data.length !== 0){
          this.tempDoctorQuota = res.data;
          this.allItems = res.data;
          this.setPage(1);
        }else{
          this.showNotFoundMsg = true;
        }
        this.showWaitMsg = false;
        return res.data;
      } else {
        this.showNotFoundMsg = true;
        return [];
      }
    });
  }

  searchDoctor(str: any) {
    this.allItems = this.tempDoctorQuota;
    const name = str.value;

    const filter = this.allItems.filter((a) => {
      return (a.name.toLowerCase().includes(name.toLowerCase()));
    });

    this.allItems = filter;
    this.setPage(1);
  }


  setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
    }
		// get pager object from service
  this.pager =  this.doctorService.getPager(this.allItems.length, page);

		// get current page of items
  this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
	}
}
