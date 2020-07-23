import {Injectable} from '@angular/core';
import {OrderFormsComponent} from './components/order-forms/order-forms.component';
import {MatDialog} from '@angular/material/dialog';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {
  width = '60%';

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver) {
    this.getBreakPoint();
  }

  // BREAKPOINT
  getBreakPoint() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(value => {
      if (value.matches) {
        this.width = '94%';
      }});
  }
  openOrderForm(icon) {
    const dialogRef = this.dialog.open(OrderFormsComponent, {
      hasBackdrop: true,
      width: this.width,
      height: 'auto',
      data: {
        title: icon.title,
        id: icon.id,
        img: icon.img[0],
        price: icon.price,
        available: icon.available,
        code: icon.code,
        height: icon.height,
        width: icon.width,
        paints: icon.paints,
        pairs: icon.pairs
      }
    });
  }
}
