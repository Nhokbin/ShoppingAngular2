import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { NotificationService } from '../core/services/notification.service';
import { AuthenticationService } from '../core/services/authentication.service';


export const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [AuthenticationService, NotificationService],

  declarations: [LoginComponent]
})
export class LoginModule { }
