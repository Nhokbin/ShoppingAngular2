import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { MessageConstants } from '../core/common/message.constants';
import { UrlConstants } from '../core/common/url.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  jwt: string = '';
  model: any = {};
  returnUrl: string;

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    document.body.className = '';
    document.body.classList.add('login');
  }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    console.log(this.model);
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(data => {

        this.router.navigate([UrlConstants.HOME]);

      }, error => {
        this.notificationService.printErrorMessage(MessageConstants.SYSTEM_ERROR_MSG);
        this.loading = false;
      });

    // if (this.jwt.length>0) {
    console.log(this.jwt);

    //}

  }

}
