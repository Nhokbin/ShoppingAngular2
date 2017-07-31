import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

declare var moment: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  @ViewChild('avatar') avatar;

  public myRoles: any[];
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';

  public imageSrc: string = SystemConstants.BASE_API;
  public users: any[];
  public entity: any;
  public roles: any[];
  public roleOptions: IMultiSelectOption[];

  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _uploadService: UploadService,
    private _utilityService: UtilityService,
    public _authorizationService: AuthorizationService) {

  }

  ngOnInit() {
    this.loadData();
    this._authorizationService.checkAccess('USER').then((result: boolean) => {
      console.log("check");
      if (result == false) {
        this._utilityService.navigateToLogin();
      } else if (this._authorizationService.hasPermission('USER', 'CREATE') || this._authorizationService.hasPermission('USER', 'UPDATE')) {
        this.loadRoles();
      }
    });
  }

  ngAfterViewInit() {
    
  }

  loadData() {
    this._dataService.get('/api/user/get-all?pageSize=' + this.pageSize + '&page=' + this.pageIndex + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.users = response.content;
        this.pageIndex = response.number + 1;
        this.totalRow = response.totalElements;
        this.pageSize = response.size;
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }


  loadRoles() {
    this.roleOptions = [];
    this._dataService.get('/api/role/get-roles')
      .subscribe((response: any) => {
        this.roles = response;
        this.roles.forEach((role) => {
          this.roleOptions.push({
            id: role.id,
            name: role.role
          });
        });
      }, error => {
        this._dataService.handleError(error);
      });
  }

  loadUserDetail(id: any) {
    this._dataService.get('/api/user/get-detail?id=' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.dateOfBirth = moment(this.entity.dateOfBirth).format('DD/MM/YYYY');
        this._dataService.get('/api/role/get-by-user?userId=' + id).subscribe((response: any) => {
          response.forEach((role) => {
            this.myRoles.push(role.id)
          });
        }, error => {
          this._dataService.handleError(error);
        })
      }, error => {
        this._dataService.handleError(error);
      });
  }

  showAddModal() {
    this.myRoles = [];
    this.entity = {};
    this.modalAddEdit.show();
  }

  showEditModal(id: any) {
    this.myRoles = [];
    this.loadUserDetail(id);
    this.modalAddEdit.show();
  }

  search() {
    this.loadData();
  }

  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(
      MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemConfirm(id));
  }

  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/user/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    }, error => {
      this._dataService.handleError(error);
    });
  }

  saveChange(valid: boolean) {
    if (valid) {
      let fi = this.avatar.nativeElement; // lấy ra giá trị trong view Avatar
      console.log(fi.files.length);
      if (fi.files.length > 0) {
        this._uploadService.postWithFile('/api/upload/', null, fi.files)
          .then((imageUrl: string) => {
            this.entity.avatar = imageUrl;
          })
          .then(() => {
            this.saveData();
          });
      } else {
        this.saveData();
      }
    }
  }

  saveData() {
    let data = {
      user: this.entity,
      userRoles: this.myRoles
    }

    console.log(data);

    if (this.entity.id === undefined) {
      this._dataService.post('/api/user/create', JSON.stringify(data))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    } else {
      this._dataService.put('/api/user/update', JSON.stringify(data))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageConstants.UPDATE_OK_MSG);

        }, error => this._dataService.handleError(error));
    }
  }

  public selectGender(event) {
    this.entity.gender = event.target.value;
  }

  public selectStatus(event) {
    this.entity.active = event.target.value;
  }

  public selectedDate(value: any) {
    console.log(value);
    this.entity.dateOfBirth = moment(value.start._d).format('DD/MM/YYYY');
    console.log(this.entity.dateOfBirth);
  }
}
