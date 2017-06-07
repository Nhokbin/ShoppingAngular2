import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { SystemConstants } from '../../core/common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  constructor(private _http: Http) { }

  login(username: string, password: string) {
    let body = {
      'username': username,
      'password': password
    };
    let headers = new Headers();

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });

    return this._http.post(SystemConstants.BASE_API + '/api/login', body, options).map((response: Response) => {
      let user: LoggedInUser;
      let authorization: string = response.headers.get('Authorization')
      console.log(authorization);
      if (authorization) {
        user.access_token = authorization;
        localStorage.removeItem(SystemConstants.CURRENT_USER);
        localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
      }

    });
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
  }

  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user != null) {
      return true
    }
    return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedInUser(
        userData.access_token,
        userData.username,
        userData.fullname,
        userData.email,
        userData.avatar
      );
    }else{
      user = null;
    }
    return user;
  }
}