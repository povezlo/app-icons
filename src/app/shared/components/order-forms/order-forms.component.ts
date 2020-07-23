import {Component, Inject, OnInit} from '@angular/core';
import {IconComponent} from '../icon/icon.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LocalStorageService} from '../../local-storage.service';

class DialogData {
  title: string;
  img: any;
  paints: string;
  code: any;
  height: any;
  width: any;
  price: any;
  available: boolean;
  pairs: boolean;
}

@Component({
  selector: 'app-order-forms',
  templateUrl: './order-forms.component.html',
  styleUrls: ['./order-forms.component.scss']
})
export class OrderFormsComponent implements OnInit {
  score: number;
  constructor(
    public dialogRef: MatDialogRef<IconComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.getItemsAmount();
  }

  getItemsAmount() {
    let itemArr = this.item;
    itemArr = itemArr.filter((elem) => elem.code === this.data.code);
    if (itemArr) {
      this.score = itemArr[0].item;
    } else {
      this.score = 1;
    }
  }

  removeItems() {
    if (this.score > 1) {
        this.localStorageService.storeOnLocalStorage(this.data, 1);
        this.score--;
      }
  }
  addItems() {
    this.localStorageService.storeOnLocalStorage(this.data);
    this.score++;
  }
  get item() {
    if (localStorage.getItem('Icons order to cart')) {
      return  JSON.parse(localStorage.getItem('Icons order to cart'));
    }
  }
}
