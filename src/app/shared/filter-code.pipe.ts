import { Pipe, PipeTransform } from '@angular/core';
import {Icon} from './interfaces';

@Pipe({
  name: 'filterCode'
})
export class FilterCodePipe implements PipeTransform {

  transform(arr: any, filterId: number = null): [] {
    if (!filterId === null) {
      return arr;
    }
    return  arr.filter(el => el === filterId);
  }

}
