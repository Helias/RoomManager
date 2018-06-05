import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as globals from "../globals";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient, private router: Router) {}

  username = "";
  password = "";

  ngOnInit() {}

  public login() {

    this.http.post(globals.API + "authenticate", {
      username: this.username,
      password: this.password
    }).subscribe((data) => {

      if (data["token"] != null) {
        localStorage.setItem('id_token', data["token"]);
        this.router.navigate(['admin']);
      }
    });

  }

}
