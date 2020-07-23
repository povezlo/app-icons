import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LabelType} from 'ng5-slider';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Icon} from '../../interfaces';
import {FilterNavBarService} from '../../filter-nav-bar.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {SelectionModel} from '@angular/cdk/collections';
import {WorkWithFirebaseIconsService} from '../../work-with-firebase-icons.service';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltip, MatTooltipDefaultOptions} from '@angular/material/tooltip';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 100,
  hideDelay: 100,
  touchendHideDelay: 100,
};

class Options {
}

@Component({
  selector: 'app-left-navbar',
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.scss'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class LeftNavbarComponent implements OnInit {
  get selectedOptions(): SelectionModel<MatListOption> {
    return this._selectedOptions;
  }

  set selectedOptions(value: SelectionModel<MatListOption>) {
    this._selectedOptions = value;
  }

  @ViewChild('tooltip') manualTooltip: MatTooltip;
  @ViewChild('checkItems') checkItems: MatSelectionList;
  @Output() getFilter: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line:no-input-rename
  @Input('matBadgeHidden') hidden: boolean;
  iconsAll: Icon[];
  disabled: boolean;
  hiddenBadge: boolean;
  // tslint:disable-next-line:variable-name
  private _selectedOptions: SelectionModel<MatListOption>;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chips = [];
  minValue = 0;
  maxValue = 30000;
  filter = [];
  hasIcons = [];
  options: Options = {
    floor: 0,
    ceil: 30000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '₴' + value;
        case LabelType.High:
          return '₴' + value;
        default:
          return '₴' + value;
      }
    }
  };

  constructor(private filterSelected: FilterNavBarService,
              private firebaseIconService: WorkWithFirebaseIconsService) {
  }

  ngOnInit(): void {
    this.firebaseIconService.getAll().subscribe((icons) => {
      this.iconsAll = icons;
      this.hasIcons = this.iconsAll;
      this.disabled = false;
      this.hiddenBadge = true;
    });
  }

  getValue() {
    const value = this.checkItems._value || [];
    this.filter = value.map(el => el.toLowerCase());
    this.chips = this.filter;
    if (this.minValue !== 0 || this.maxValue !== 30000) {
      this.filter.push(...[this.minValue, this.maxValue]);
    }
  }

  save() {
    this.getValue();
    this.getFilter.emit(this.filter);
    if (this.filter.length === 0) {
      this.hasIcons = this.iconsAll;
    }
  }

  deselectAll() {
    this.checkItems.deselectAll();
    this.maxValue = 30000;
    this.minValue = 0;
    this.filter = [];
    this.getFilter.emit(this.filter);
    this.hasIcons = [];
    this.chips = [];
    this.hasIcons = this.iconsAll;
  }

  selectionChange(option?: MatSelectionListChange) {
    this.getValue();
    this.hasIcons = this.filterSelected.filter(this.iconsAll, this.filter);
    this._selectedOptions = option.source.selectedOptions;
  }

  // CHIPS
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our badge
    if ((value || '').trim()) {
      this.chips.push({name: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(badge): void {
    const index = this.chips.indexOf(badge);
    if (index >= 0) {
      this.chips.splice(index, 1);
      if (typeof badge === 'number') {
        if (badge === this.minValue) {
          this.minValue = 0;
        } else {
          this.maxValue = 30000;
        }
      }
      // tslint:disable-next-line:no-unused-expression
      this._selectedOptions.selected.forEach(val => {
        if (val.value === badge) {
          val.selected = false;
        }
      });
    }
  }
}
