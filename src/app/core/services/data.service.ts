import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { SystemConstants } from './../common/system.constants';
import { MessageConstants } from './../common/message.constants';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
  private headers: Headers;
  constructor(private _http: Http, private _router: Router,
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService) { 

      this.headers = new Headers();
      this.headers.append('Content-Type','application/json');

    }

  get(url: string) {

    this.headers.delete("Authorization");
    this.headers.append('Authorization', this._authenticationService.getLoggedInUser().access_token);

    return this._http.get(SystemConstants.BASE_API + url, { headers: this.headers }).map(this.extracData);
  }

  post(url: string, data?: any) {

    this.headers.delete("Authorization");
    this.headers.append('Authorization', this._authenticationService.getLoggedInUser().access_token);

    return this._http.post(SystemConstants.BASE_API + url, data, { headers: this.headers }).map(this.extracData);
  }

  put(url: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append('Authorization', this._authenticationService.getLoggedInUser().access_token);

    return this._http.put(SystemConstants.BASE_API + url, data, { headers: this.headers }).map(this.extracData);
  }

  delete(url: string, key: string, id: string) {
    this.headers.delete("Authorization");
    this.headers.append('Authorization', this._authenticationService.getLoggedInUser().access_token);

    return this._http.delete(SystemConstants.BASE_API + url + "/?" + key + "=" + id, { headers: this.headers }).map(this.extracData);

  }

  postFile(url: string, data?: any) {

    let newHeader = new Headers();

    newHeader.append('Authorization', this._authenticationService.getLoggedInUser().access_token);

    return this._http.post(SystemConstants.BASE_API + url, data, { headers: this.headers }).map(this.extracData);

  }

  private extracData(res: Response) {
    let body = res.json();
    return body || {};
  }

  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MSG);
      this._utilityService.navigateToLogin();
    } else {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Lỗi hệ thống';
      this._notificationService.printErrorMessage(errMsg);

      return Observable.throw(errMsg);
    }
  }

}
