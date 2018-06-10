import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as globals from "../globals";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private _notifications: NotificationsService) { }

  ngOnInit() { }

  g = globals;

  loggingOut() {
    this._notifications.create("Login", "Logout effettuato!", "warn", globals.confNotifications);
    globals.logout();
    this.router.navigate(['login']);
  }

}
