import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FunctionComponent} from './function.component';
import {Routes, RouterModule} from '@angular/router';
import {DataService} from '../../core/services/data.service';
import {NotificationService} from '../../core/services/notification.service';
import {PaginationModule, ModalModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {MdRadioModule, MdCheckboxModule} from '@angular/material';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {Daterangepicker} from 'ng2-daterangepicker';
import {TreeModule} from 'angular-tree-component';

const functionRoutes: Routes = [
  {path: '', redirectTo: 'index', pathMatch: 'full'},
  {path: 'index', component: FunctionComponent}
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdRadioModule,
    MdCheckboxModule,
    MultiselectDropdownModule,
    Daterangepicker,
    ModalModule.forRoot(),
    PaginationModule,
    RouterModule.forChild(functionRoutes),
    TreeModule
  ],
  declarations: [FunctionComponent],
  providers: [DataService, NotificationService]
})
export class FunctionModule {
}
