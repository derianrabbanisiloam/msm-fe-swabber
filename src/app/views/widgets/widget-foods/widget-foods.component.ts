import { Component, OnInit } from '@angular/core';
import { Food } from '../../../models/food';
import { FormHandlerMessage } from '../../../models/formHandlerMessage';

@Component({
  selector: 'app-widget-foods',
  templateUrl: './widget-foods.component.html',
  styleUrls: ['./widget-foods.component.css']
})
export class WidgetFoodsComponent implements OnInit {

  public food: Food = new Food;

  public foodData: Food;

  public formHandlerMessage = new FormHandlerMessage;

  constructor() { }

  ngOnInit() {
  }

  addFood() {
    this.foodData = this.food;
    console.log(this.foodData);
  }

}
