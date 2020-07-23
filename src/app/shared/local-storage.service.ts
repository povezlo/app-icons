import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {Icon} from './interfaces';
// key that is used to access the data in local storage
const STORAGE_LENGTH_KEY = 'Icons order to cart length';
const STORAGE_KEY = 'Icons order to cart';
@Injectable()

export class LocalStorageService {
  // get array of tasks from local storage
  private amount = this.storage.get(STORAGE_LENGTH_KEY) || 0;
  private currentIconsList = this.storage.get(STORAGE_KEY) || [];
  private totalPrice = 0;
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public storeOnLocalStorage(icon: Icon, minus?: any): void {
    let hasIcon = false;
    // checking double item
    if (this.storage.get(STORAGE_KEY)) {
      this.currentIconsList = this.currentIconsList.map((elem) => {
        if (elem.code === icon.code) {
          if (minus) {
            elem.item--;
          } else {
            elem.item++;
          }
          hasIcon = true;
          return elem;
        } else {
          return elem;
        }
      });
    }
    // push new task to array
    if (!hasIcon) {
      this.currentIconsList.push({
        icon,
        code: icon.code,
        item: 1
      });
    }
    // add Icons order to cart length
    if (minus) {
      this.amount--;
    } else {
      this.amount++;
    }

    // insert updated array to local storage
    this.storage.set(STORAGE_KEY, this.currentIconsList);
    this.storage.set(STORAGE_LENGTH_KEY, this.amount);
    console.log('LocaL storage is', this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
  }
  public storeOnLocalStorageRemove(idIcon: any): void {
    // get array of tasks from local storage
    this.currentIconsList.forEach(el => {
      if (el.icon.code === idIcon) {
        this.amount = this.amount - el.item;
      }
    });
    this.currentIconsList = this.currentIconsList.filter(el => el.code !== idIcon);
    if (this.currentIconsList.length > 0) {
      // // insert updated array to local storage
      this.storage.set(STORAGE_KEY, this.currentIconsList);
      this.storage.set(STORAGE_LENGTH_KEY, this.amount);
    } else {
      localStorage.removeItem(STORAGE_LENGTH_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  public storeOnLocalStorageTotalPrice(): number {
    this.totalPrice = 0;
    this.currentIconsList.forEach(el => {
      this.totalPrice = this.totalPrice + (el.icon.price * el.item);
    });
    return this.totalPrice;
  }
}
