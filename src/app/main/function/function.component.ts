import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent } from 'angular-tree-component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/common/message.constants';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {
  @ViewChild('addEditModal')
  public addEditModal: ModalDirective;

  @ViewChild('permissionModal')
  public permissionModal: ModalDirective;

  @ViewChild(TreeComponent)
  private treeFunction: TreeComponent;

  public _functionHierachy: any[];
  public _function: any[];
  public _roles: any[];
  public _myRoles: any[];
  public _actions: any[];
  public _myActions: any[];

  public functionId;
  public roleId: number;
  public nameAction: string;
  public entity: any;
  public editFlag: boolean;
  public filter = '';

  options = {
    childrenField: 'children'
  }

  constructor(private _dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    this.search();
  }

  public search() {
    this._dataService.get('/api/function/get-all?filter=' + this.filter)
      .subscribe((response: any) => {
        this._functionHierachy = this.utilityService.Unflatten(response);

        console.log("test");
        console.log(this._functionHierachy);

      }, error => {
        this._dataService.handleError(error);
      });
  }

  public showAddModal() {
    this.entity = {};
    this.addEditModal.show();
    this.editFlag = false;
  }

  //Show edit form
  public showEdit(id) {
    this._dataService.get('/api/function/detail?id=' + id).subscribe((response: any) => {
      this.entity = response;
      console.log(this.entity);
      this.editFlag = true;
      this.addEditModal.show();
    }, error => this._dataService.handleError(error));
  }

  public changeRole() {
    console.log(this.roleId);
    this._dataService.get('/api/permission/get-permissions?functionId=' + this.functionId + '&roleId=' + this.roleId + '&nameAction=' + this.nameAction)
      .subscribe((response: any) => {
        this._myActions = response;
        this._actions.forEach((action) => {
          if (this._myActions.includes(action.id)) {
            action.myAction = true;
          } else {
            action.myAction = false;
          }
        });
        console.log(response);
        console.log(this._actions);
      }, error => {

      });
  }
  public showPermission(id, name: string) {
    this.nameAction = name;
    this._myRoles = [];
    this._myActions = [];
    this.roleId = 0;
    this._dataService.get('/api/role/get-roles').subscribe((response: any[]) => {
      this.functionId = id;
      this._roles = response;
      console.log(this._roles);
      this._dataService.get('/api/action/get-by-type?name=' + name).subscribe((response: any) => {
        console.log(response);
        this._actions = response;
        this._actions.forEach((action) => {
          action.myAction = false;
        });
        this.permissionModal.show();
      }, error => {
        this._dataService.handleError(error);
      });
    }, error => {
      this._dataService.handleError(error);
    });
  }

  public savePermission(valid: boolean) {
    console.log(this._myActions);
    if (valid) {
      const data = {
        role: this.roleId,
        function: this.functionId,
        actions: this._myActions
      }
      console.log(data);
      this._dataService.post('/api/permission/save-permission', JSON.stringify(data)).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.permissionModal.hide();
      }, error => {
        this._dataService.handleError(error);
      });
    }
  }
  //Save change for modal popup
  public saveChanges(valid: boolean) {

    if (valid) {
      if (this.entity._parentId != null && this.entity._parentId != 0) {
        this.entity.parentId = {
          id: this.entity._parentId
        }
      }

      if (this.editFlag == false) {
        console.log(this.entity);
        this._dataService.post('/api/function/add', this.entity).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
      }
      else {
        this._dataService.put('/api/function/update', this.entity).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageConstants.UPDATE_OK_MSG);
        }, error => this._dataService.handleError(error));

      }
    }

  }

  showEditAction(id: number) {

  }

  public delete(id) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => this.deleteConfirm(id));
  }

  public deleteConfirm(id) {
    this._dataService.delete('/api/function/delete', 'id', id).subscribe((response: any) => {
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }


  public onChange(actionId, isChecked) {

    console.log(isChecked);

    if (isChecked.checked) {
      this._myActions.push(actionId);
    } else {
      this._myActions.splice(this._myActions.indexOf(actionId), 1);
    }
  }
}
