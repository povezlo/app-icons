import { NgModule } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MAT_CHECKBOX_CLICK_ACTION, MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {config} from 'rxjs';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MaterialFileInputModule, NGX_MAT_FILE_INPUT_CONFIG} from 'ngx-material-file-input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRippleModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';

const MaterialModules = [
  MatListModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatCardModule,
  MatProgressBarModule,
  MatSortModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatSelectModule,
  MatSliderModule,
  MatIconModule,
  MaterialFileInputModule,
  MatMenuModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatTabsModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatChipsModule,
  MatBadgeModule,
  MatButtonToggleModule,
  MatStepperModule,
  MatRippleModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatDialogModule
]

@NgModule({
  declarations: [],
  imports: [MaterialModules],
  exports: [MaterialModules],
  providers: [{ provide: NGX_MAT_FILE_INPUT_CONFIG, useValue: config },
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}]
})
export class MaterialModule { }
