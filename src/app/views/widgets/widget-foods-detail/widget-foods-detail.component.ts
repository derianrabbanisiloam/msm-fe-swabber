import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Food } from '../../../models/food';

@Component({
  selector: 'app-widget-foods-detail',
  templateUrl: './widget-foods-detail.component.html',
  styleUrls: ['./widget-foods-detail.component.css']
})
export class WidgetFoodsDetailComponent implements OnInit {

  @Input() food: Food;

  constructor() { }

  ngOnInit() {
    console.log(this.food)
  }

}
