import { Injectable } from '@angular/core';
import { LoggedInUser } from '../domain/loggedin.user';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthorizationService {
  private user: any;
  private permission: any[];
  private roles: any[];

  constructor(
    private _authenticationService: AuthenticationService,
    private _dataService: DataService
  ) {
    this.user = this._authenticationService.getLoggedInUser();
    console.log("12111111111111113");
  }

  getPermission(functionId: string, userId: string) {
    return new Promise((resolve, reject) => {
      this._dataService.get('/api/permission/get-permissions-function?functionId=' + functionId + "&userId=" + userId)
        .subscribe((response: string) => {
          this.permission = response.toString().split(',');
        }, error => {
          this._dataService.handleError(error);
        });
    });
  }

  checkAccess(functionId: string) {
    var result: boolean = false;
    return new Promise((resolve, reject) => {
      this._dataService.get('/api/permission/get-permissions-function?functionId=' + functionId + "&userId=" + this.user.id)
        .subscribe((response: string) => {
          this.permission = response.toString().split(',');
          this.roles = this.user.roles.toString().split(',');
          var hasPermission: number = this.permission.indexOf("GET");
          if (hasPermission != -1 || this.roles.indexOf("ADMIN") != -1)
            result = true;
          resolve(result);
        }, error => {
          this._dataService.handleError(error);
        });
    });
  }

  hasPermission(functionId: string, action: string): boolean {
    if(this.permission == undefined || this.permission == null){
      return false;
    }
    
    var result: boolean = false;
    this.roles = this.user.roles;
    if (this.roles.indexOf("ADMIN") != -1)
      return true;

    switch (action) {
      case 'CREATE':
        var hasPermission: number = this.permission.indexOf("CREATE");
        if (hasPermission != -1)
          result = true;
        break;
      case 'UPDATE':
        var hasPermission: number = this.permission.indexOf("UPDATE");
        if (hasPermission != -1)
          result = true;
        break;
      case 'DELETE':
        var hasPermission: number = this.permission.indexOf("DELETE");
        if (hasPermission != -1)
          result = true;
        break;
    }
    return result;
  }
}
