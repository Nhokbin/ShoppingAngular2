import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {


  constructor(private _dataService: DataService) { }

  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public totalPages: number;
  public filter: string = '';
  public roles: any[];

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this._dataService.get('/api/role/get-all?pageSize=' + this.pageSize + '&page=' + this.pageIndex + '&filter=' + this.filter)
      .subscribe((response: any) => {
        console.log(response);
        this.roles = response.content;
        this.totalPages = response.totalPages;
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
}
