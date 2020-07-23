import {Component, Input, OnInit} from '@angular/core';
import {Icon} from '../../interfaces';
import {OpenDialogService} from '../../open-dialog.service';
import {LocalStorageService} from '../../local-storage.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() icon: Icon;

  constructor(
    private  dialog: OpenDialogService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  openOrderForm(icon: Icon) {
    this.localStorageService.storeOnLocalStorage(icon);
    this.dialog.openOrderForm(icon);
  }
}
