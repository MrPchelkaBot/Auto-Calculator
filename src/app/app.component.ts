import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

class ServiceCart {
  id: string;
  name: string;
  price: number;

  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

interface Services {
  id: number;
  value: string;
  subs: Array<SubServices>;
}

interface SubServices {
  id: number;
  value: number;
  services: Array<ListService>
}

interface ListService {
  id: number;
  name: string;
  price: number;
  price2: number;
  description: string;
  selected: boolean;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getJSON().subscribe(data => {
      this.typesOfServices = data.service;
      this.type_auto_1 = data.type[0];
      this.type_auto_2 = data.type[1];
    })
  }

  constructor(private http: HttpClient) {

  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/services.json");
  }

  amount: number = 0;
  type_car: number = 1;

  type_auto_1: string;
  type_auto_2: string;



  typesOfServices: Array<Services> = [];

  addingServices: Array<ServiceCart> = []

  active_level1: number = 1;
  active_level2: number = this.active_level1 + 0.1;


  click_level_1(id: number) {
    this.active_level1 = id;
    this.active_level2 = id + 0.1;
  }

  click_level_2(id: number) {
    this.active_level2 = id;
  }

  selectService(name: string, price: number, id: number, lev1: number, lev2: number) {
    if (!this.checkSelected(id, lev1, lev2)) {
      // tslint:disable-next-line: max-line-length
      this.typesOfServices.filter(t => t.id === lev1).map(t => t.subs.filter(s => s.id === lev2))[0][0].services.find(s => s.id === id).selected = true;
      let data = new ServiceCart(lev1.toString() + lev2.toString() + id.toString(), name, price);
      this.addingServices.push(data);
      this.amount += price;
    }
    else {
      // tslint:disable-next-line: max-line-length
      this.typesOfServices.filter(t => t.id === lev1).map(t => t.subs.filter(s => s.id === lev2))[0][0].services.find(s => s.id === id).selected = false;
      let item = this.addingServices.find(t => t.id === (lev1.toString() + lev2.toString() + id.toString()));
      let index = this.addingServices.indexOf(item);
      if (index > -1) { this.addingServices.splice(index, 1); }
      this.amount -= price;
    }
  }

  checkSelected(id: number, lev1: number, lev2: number): boolean {
    return this.typesOfServices.filter(t => t.id === lev1).map(t => t.subs.filter(s => s.id === lev2))[0][0].services.find(s => s.id === id).selected;
  }

  zakaz() {
    console.log(this.addingServices)
  }

  reset(n: number) {
    if (this.type_car === n) return;
    this.type_car = n;
    this.amount = 0;
    this.active_level1 = 1;
    this.active_level2 = 1 + 0.1;
    this.addingServices = [];
    this.typesOfServices.forEach(t => t.subs.forEach(t1 => t1.services.forEach(t2 => {
      t2.selected = false;
    })))

  }


}
