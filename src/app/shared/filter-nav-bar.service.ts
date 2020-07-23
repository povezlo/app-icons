import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterNavBarService {

  constructor() {
  }


  filter(filter: any[], selected: any[]) {
    // ФИЛЬТР ПО ЦЕНЕ
    const rangePrice = selected.filter(el => typeof el === 'number');
    if (rangePrice.length) {
      filter = filter.filter(icon => +icon.price >= rangePrice[0] && +icon.price <= rangePrice[1]);
    }
    // ФИЛЬТР ПО КРАСКАМ

    const paints = [];
    // @ts-ignore
    selected = selected.filter(el => {
      if (el === 'темперные краски' || el === 'без письма' || el === 'масленные краски') {
        paints.push(el);
      } else {
        return el;
      }
    });
    if (paints.length) {
      filter = filter.filter(icon => icon.paints.toLowerCase() === paints[0] ||
        icon.paints.toLowerCase() === paints[1] || icon.paints.toLowerCase() === paints[2]);
    }

    // ФИЛЬТР ПО РАЗМЕРУ
    const width = [];
    const height = [];
    // @ts-ignore
    // ФИЛЬТР ПО ШИРИНЕ
    selected = selected.filter(el => {
      if (el === 'ширина до 200' || el === 'ширина от 200 до  300' || el === 'ширина от 300 до 400' || el === 'ширина от 400 и выше') {
        width.push(el);
      } else {
        return el;
      }
    });
    if (width.length) {
      filter = filter.filter(icon => {
        let check;
        for (const el of width) {
          switch (el) {
            case 'ширина до 200':
              check = check || icon.width <= 200;
              break;
            case 'ширина от 200 до  300':
              check = check || +icon.width > 200 && +icon.width <= 300;
              break;
            case 'ширина от 300 до 400':
              check = check || +icon.width > 300 && +icon.width <= 400;
              break;
            case 'ширина от 400 и выше':
              check = check || +icon.width > 400;
              break;
              return check;
          }
        }
        return check;
      });
    }
    // ФИЛЬТР ПО ВЫСОТЕ
    // @ts-ignore
    selected = selected.filter(el => {
      if (el === 'высота до 200' || el === 'высота от 200 до  300' || el === 'высота от 300 до 400' || el === 'высота от 400 и выше') {
        height.push(el);
      } else {
        return el;
      }
    });
    if (height.length) {
      filter = filter.filter(icon => {
        let check;
        for (const el of height) {
          switch (el) {
            case 'высота до 200':
              check = check || icon.height <= 200;
              break;
            case 'высота от 200 до  300':
              check = check || +icon.height > 200 && +icon.height <= 300;
              break;
            case 'высота от 300 до 400':
              check = check || +icon.height > 300 && +icon.height <= 400;
              break;
            case 'высота от 400 и выше':
              check = check || +icon.height > 400;
              break;
              return check;
          }
        }
        return check;
      });
    }
    // ФИЛЬТР ПО ИМЕНИ ICON.TITLE
    const hasText = selected.filter(el => typeof el === 'string');
    if (hasText.length) {
      filter = filter.filter(icon => {
        for (const el of selected) {
          // tslint:disable-next-line:no-shadowed-variable
          if (icon.title.toLowerCase().includes(el)) {
            return true;
          }
        }
      });
    }
    return filter;
  }
}

