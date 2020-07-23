import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  title = 'app';
  hasCartOrder: number;
  constructor() { }

  ngOnInit() {
  }
  get item() {
    if (localStorage.getItem('Icons order to cart')) {
      return  localStorage.getItem('Icons order to cart length');
    }
    return this.hasCartOrder = null;
  }
}
