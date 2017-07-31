import { Component, OnInit } from '@angular/core';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { AuthenticationService } from '../../core/services/authentication.service';
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  public user: LoggedInUser;
  constructor(private _authenService: AuthenticationService) { }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
  }

}
