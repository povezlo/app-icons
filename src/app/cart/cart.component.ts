import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {distinctUntilChanged, startWith} from 'rxjs/operators';
import {LocalStorageService} from '../shared/local-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public icons = new BehaviorSubject<Array<any>>(this.orderItems);
  totalPrice: number;
  available: boolean;
  hasCartOrder: number;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  lastFormGroup: FormGroup;
  cities: any;
  getWarehouse: any;
  getWarehouseCash: any;

  constructor(
    // tslint:disable-next-line:variable-name
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      family: ['', Validators.required],
      nameMiddle: ['', Validators.required],
      phone: [null, Validators.required],
      email: ['', Validators.email]
    });
    this.secondFormGroup = this._formBuilder.group({
      poshta: ['novaPoshta', Validators.required],
      city: ['', Validators.required],
      depart: ['', Validators.required],
      selectedPoshta: ['', Validators.required]
    });
    this.lastFormGroup = this._formBuilder.group({
      oplata: ['', Validators.required]
    });
    this.hasAvailable();
    this.getTotalPrice();
  }
  // LOCAL STORAGE GET SET
  get item() {
    if (localStorage.getItem('Icons order to cart')) {
      return  localStorage.getItem('Icons order to cart length');
    }
    return this.hasCartOrder = null;
  }

  public  get orderIcons(): Observable<Array<any>> {
    return this.icons.asObservable();
  }

  public  get orderItems() {
    return JSON.parse(localStorage.getItem('Icons order to cart'));
  }
// BUTTON BLOCK - + DELETE
  removeItems(icon, amount) {
    if (amount > 1) {
      this.totalPrice = this.totalPrice - +icon.price;
      this.localStorageService.storeOnLocalStorage(icon, 1);
      this.icons = new BehaviorSubject<Array<any>>(this.orderItems);
    }
  }

  addItems(icon) {
    this.totalPrice = this.totalPrice + +icon.price;
    this.localStorageService.storeOnLocalStorage(icon);
    this.icons = new BehaviorSubject<Array<any>>(this.orderItems);
  }

  deleteItems(icon, id) {
    console.log('remove items', id);
    this.totalPrice = this.totalPrice - +icon.price;
    this.localStorageService.storeOnLocalStorageRemove(id);
    this.icons = new BehaviorSubject<Array<any>>(this.orderItems);
  }
  // GET TOTAL PRICE
  getTotalPrice() {
    if (localStorage.getItem('Icons order to cart')) {
      this.totalPrice = this.localStorageService.storeOnLocalStorageTotalPrice();
    }
  }
// CHECK HAS AVAILABLE ICONS
  hasAvailable() {
    if (localStorage.getItem('Icons order to cart')) {
      let arr = JSON.parse(localStorage.getItem('Icons order to cart'));
      arr = arr.filter(el => !el.icon.available);
      if (arr.length > 0) {
       this.available = false;
      } else {
        this.available = true;
      }
    }
    console.log('arr', this.available);
  }

  displayFn(user): string {
    return user && user.Description ? user.Description : '';
  }

  // GET SET API BLOCK

  // API NOVA POSHTA
  getWarehouses() {
    if (this.secondFormGroup.controls.city.value) {
      const city = this.cities[0].Ref;
      this.http.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: 'f812ec25ffbe2a3f7afdddfa8905f1a2',
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: city
        }
      }).subscribe(v => {
        // @ts-ignore
        this.getWarehouseCash = v.data;
        this.getWarehouse = this.getWarehouseCash;
      });
    }
  }

  getCitytoApi(event: Event) {
    const getcity = (event.target as HTMLInputElement).value;
    this.http.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: 'f812ec25ffbe2a3f7afdddfa8905f1a2',
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: getcity
      }
    }).pipe(
      startWith(''),
      distinctUntilChanged()
    ).subscribe(v => {
      // @ts-ignore
      this.cities = v.data;
    });
  }

  SelectedWarehouses(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (!input.length) {
      this.getWarehouse = this.getWarehouseCash;
    } else {
      this.getWarehouse = this.getWarehouseCash.filter(option => option.Description.toLowerCase()
        .replace(/\s/g, '').includes(input.toLowerCase()));
      // console.log('input', input, 'getWarehouses', this.getWarehouse);
    }

  }


  // Wayforpay() {
  //
  //   const API = {
  //     merchantAccount: 'test_merch_n1',
  //     merchantDomainName: 'www.market.ua',
  //     authorizationType: 'SimpleSignature',
  //     merchantSignature: 'b95932786cbe243a76b014846b63fe92',
  //     orderReference: 'DH783023',
  //     requestType: 'VERIFY',
  //     straightWidget: true,
  //     orderDate: '1415379863',
  //     amount: '1547.36',
  //     currency: 'UAH',
  //     productName: 'Процессор Intel Core i5-4670 3.4GHz',
  //     productPrice: '1000',
  //     productCount: '1',
  //     clientFirstName: 'Вася',
  //     clientLastName: 'Васечкин',
  //     clientEmail: 'some@mail.com',
  //     clientPhone: '380631234111',
  //     language: 'UA'
  //   };
  //   // this.http.post('https://secure.wayforpay.com/pay', API).subscribe(value => console.log(value));
  //   // @ts-ignore
  //   // const wayforpay = new Wayforpay();
  //   // const pay = () => wayforpay.run(API);
  //   // pay();
  // }

}
