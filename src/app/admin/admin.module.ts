import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AdminLayoutComponent} from './shared/components/admin-layout/admin-layout.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {CreatePageComponent} from './create-page/create-page.component';
import {EditPageComponent} from './edit-page/edit-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './shared/services/auth.guard';
import {MaterialModule} from '../material.module';
import {SharedModule} from '../shared/shared.module';
import {LoadSpinnerComponent} from './shared/components/load-spinner/load-spinner.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';
import { QuestionsPageComponent } from './questions-page/questions-page.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent,
    LoadSpinnerComponent,
    FeedbackPageComponent,
    QuestionsPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: AdminLayoutComponent, children: [
          {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
          {path: 'login', component: LoginPageComponent},
          {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard]},
          {path: 'create', component: CreatePageComponent, canActivate: [AuthGuard]},
          {path: 'icon/:id/edit', component: EditPageComponent, canActivate: [AuthGuard]},
          {path: 'feedback', component: FeedbackPageComponent, canActivate: [AuthGuard]},
          {path: 'questions', component: QuestionsPageComponent, canActivate: [AuthGuard]}
        ]
      }
    ]),
    MaterialModule
  ],
  exports: [RouterModule, LoadSpinnerComponent],
  providers: [AuthGuard]
})
export class AdminModule {

}
