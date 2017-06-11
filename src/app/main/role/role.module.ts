import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { Routes, RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

const roleRoutes: Routes = [
  { path: '', redirectTo: "index", pathMatch: 'full' },
  { path: 'index', component: RoleComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(roleRoutes)
  ],
  declarations: [RoleComponent],
  providers: [DataService, NotificationService]
})
export class RoleModule { }
