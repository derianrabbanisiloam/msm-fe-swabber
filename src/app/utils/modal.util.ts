import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalUtil {

  constructor() { }

  private modalSource1 = new Subject<boolean>();
  public modalSource1$ = this.modalSource1.asObservable();

  changemodalSource1(params: boolean) {
    this.modalSource1.next(params);
  }

}