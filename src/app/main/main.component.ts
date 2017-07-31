import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import { UtilityService } from '../core/services/utility.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { LoggedInUser } from '../core/domain/loggedin.user';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  public user: LoggedInUser;
  public imageSrc: string = SystemConstants.BASE_API;
  stompClient: any;

  constructor(private utilityService: UtilityService, private authenticationService: AuthenticationService) {
    document.body.className = '';
    document.body.classList.add('nav-md');
  }

  ngOnInit() {
    // $.getScript('../../assets/js/custom.js');
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    this.connect(this.user.id);
  }

  ngAfterViewInit() {

  }
  sendName() {
    this.stompClient.send("/app/hello", {}, JSON.stringify({ 'name': 'something' }));
  }

  connect(userId: string) {
    var that = this;
    var socket = new SockJS(SystemConstants.BASE_API + '/shopping-websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      // setConnected(true);
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/greetings', function (greeting) {
        that.showGreeting(greeting.body);
      });
    });
  }

  showGreeting(message: string) {
    console.log(message);
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }
}
