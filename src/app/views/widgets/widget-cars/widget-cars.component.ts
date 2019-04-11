import { Component, OnInit } from '@angular/core';
import { Car } from '../../../models/car';
import { FormHandlerMessage } from '../../../models/formHandlerMessage';
import { CarService } from '../../../services/car.service';

@Component({
  selector: 'app-widget-cars',
  templateUrl: './widget-cars.component.html',
  styleUrls: ['./widget-cars.component.css']
})
export class WidgetCarsComponent implements OnInit {

  public car: Car = {
    id: null,
    name: null,
    color: null,
    price: null,
  };
  public carList: Car[];
  public formHandlerMessage: FormHandlerMessage = {
    type: '',
    message: ''
  };

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getCars();
  }

  async getCars() {
    this.carList = await this.carService.getCars()
      .toPromise().then(res => {
        return res.data;
      });
  }

  async addCar() {
    await this.carService.addCar(this.car as Car)
      .toPromise().then(car => {
        this.formHandlerMessage = {
          type: 'success',
          message: 'Add car success.'
        };
        this.carList.push(car);
      }).catch(err => {
        this.formHandlerMessage = {
          type: 'error',
          message: 'Unknown error.'
        };
        throw(err.message);
      });
  }

  async updateCar(car: Car) {
    let body = {
      name: car.name,
      color: car.color,
      price: car.price
    };
    await this.carService.updateCar(body as Car)
      .toPromise().then(car => {
        this.formHandlerMessage = {
          type: 'success',
          message: `Edit car success. New name is ${car.name}`
        };
      }).catch(err => {
        this.formHandlerMessage = {
          type: 'error',
          message: 'Unknown error.'
        };
        throw(err.message);
      });
  }

  async deleteCar(carId) {
    await this.carService.deleteCar(carId)
      .toPromise().then(() => {
        this.formHandlerMessage = {
          type: 'success',
          message: `Delete car success`
        };
      }).catch(err => {
        this.formHandlerMessage = {
          type: 'error',
          message: 'Unknown error.'
        };
        throw(err.message);
      });
  }

}
