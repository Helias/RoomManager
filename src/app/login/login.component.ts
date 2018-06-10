import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as globals from "../globals";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient, private router: Router, private _notifications: NotificationsService) {}

  username = "";
  password = "";

  ngOnInit() {}

  public login() {

    this.http.get(globals.API + "auth?username=" + this.username + "&password=" + this.password).subscribe((data) => {

      if (data["success"] == false) {
        this._notifications.create("Login", "Autenticazione fallita!", "error", globals.confNotifications);
        return;
      }

      if (data["token"] != null) {
        localStorage.setItem('id_token', data["token"]);
        this._notifications.create("Login", "Autenticazione effettuata!", "success", globals.confNotifications);
        this.router.navigate(['admin']);
      }
    });

  }

}
