import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { FilterCodePipe } from './filter-code.pipe';
import { PhoneMaskDirective } from './phone-mask.directive';

@NgModule({
    imports: [HttpClientModule],
  exports: [HttpClientModule, FilterCodePipe, PhoneMaskDirective],
    declarations: [FilterCodePipe, PhoneMaskDirective]
})

export class SharedModule {
}
