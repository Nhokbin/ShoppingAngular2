import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/common/message.constants';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public roles: any[];
  public entity: any;

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService) { }



  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this._dataService.get('/api/role/get-all?pageSize=' + this.pageSize + '&page=' + this.pageIndex + '&filter=' + this.filter)
      .subscribe((response: any) => {
        console.log(response);
        this.roles = response.content;
        console.log(response.content);
        this.pageIndex = response.number + 1;
        this.totalRow = response.totalElements;
        this.pageSize = response.size;
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }

  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }

  loadRole(id: any) {
    this._dataService.get('/api/role/get-detail?id=' + id)
      .subscribe((response: any) => {
        console.log(response);
        this.entity = response;
      });
  }

  showEditModal(id: any) {
    this.loadRole(id);
    this.modalAddEdit.show();
  }

  deleteItem(id: any){
    this._notificationService.printConfirmationDialog(
      MessageConstants.CONFIRM_DELETE_MSG,
      ()=>this.deleteItemConfirm(id));
  }

  search(){
    this.loadData();
  }

  deleteItemConfirm(id: any){
    this._dataService.delete('/api/role/delete','id',id).subscribe((response:Response)=>{
      this._notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    }, error =>{
      this._dataService.handleError(error);
    });
  }

  saveChange(valid: boolean) {
    if (valid) {
      if (this.entity.id == undefined) {
        console.log(this.entity);
        this._dataService.post('/api/role/add', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            this.modalAddEdit.hide();
            this._notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      } else {
        console.log(this.entity);
        this._dataService.put('/api/role/update', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this.loadData();
            this.modalAddEdit.hide();
            this._notificationService.printSuccessMessage(MessageConstants.UPDATE_OK_MSG);
          }, error => this._dataService.handleError(error));
      }
    }
  }
}
