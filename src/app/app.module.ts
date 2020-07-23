import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {IconComponent} from './shared/components/icon/icon.component';
import {IconPageComponent} from './icon-page/icon-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {AdminModule} from './admin/admin.module';
import {LazyLoadImageModule, scrollPreset} from 'ng-lazyload-image';
import {AuthService} from './admin/shared/services/auth.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import ruLocale from '@angular/common/locales/ru-UA';
import {AuthInterceptor} from './shared/auth.interceptor';
import {SharedModule} from './shared/shared.module';
import {WorkWithFirebaseIconsService} from './shared/work-with-firebase-icons.service';
import {LeftNavbarComponent} from './shared/components/left-navbar/left-navbar.component';
import {Ng5SliderModule} from 'ng5-slider';
import {NgpSortModule} from 'ngp-sort-pipe';
import { CartComponent } from './cart/cart.component';
import {registerLocaleData} from '@angular/common';
import { AboutPageComponent } from './about-page/about-page.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HowToBuyPageComponent } from './how-to-buy-page/how-to-buy-page.component';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { GuaranteePageComponent } from './guarantee-page/guarantee-page.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { ZoomComponent } from './shared/components/zoom/zoom.component';
import { OrderFormsComponent } from './shared/components/order-forms/order-forms.component';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {StorageServiceModule} from 'ngx-webstorage-service';
import {LocalStorageService} from './shared/local-storage.service';

registerLocaleData(ruLocale, 'ua');

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    IconComponent,
    IconPageComponent,
    HomePageComponent,
    LeftNavbarComponent,
    CartComponent,
    AboutPageComponent,
    HowToBuyPageComponent,
    ContactsPageComponent,
    GuaranteePageComponent,
    FooterComponent,
    ZoomComponent,
    OrderFormsComponent
  ],
  entryComponents: [OrderFormsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AdminModule,
    SharedModule,
    LazyLoadImageModule.forRoot({
      preset: scrollPreset
    }),
    Ng5SliderModule,
    NgpSortModule,
    FlexLayoutModule,
    NgxScrollTopModule,
    StorageServiceModule
  ],
  providers: [
    AuthService,
    WorkWithFirebaseIconsService,
    LocalStorageService,
    {provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor
    },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
