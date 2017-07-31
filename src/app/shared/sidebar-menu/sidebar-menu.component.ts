import { Component, OnInit } from '@angular/core';
import { UtilityService } from './../../core/services/utility.service';
import { DataService } from './../../core/services/data.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
  public functions: any[];

  constructor(private _dataService: DataService, private utilityService: UtilityService) { }

  ngOnInit() {
    this.getData();
  }


  getData() {
    this._dataService.get('/api/function/get-all?filter=').subscribe((response: any[]) => {
     
      this.functions = this.utilityService.Unflatten(response);

      console.log(this.functions);
      
    }, error => this._dataService.handleError(error));
  }
}
