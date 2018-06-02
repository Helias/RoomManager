import { Component, OnInit } from '@angular/core';
import * as globals from "../globals";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:Http) {
//    Observable<Response> ob = this.http.post("test", book, options);
  }

  ngOnInit() {
  }

  public login() {
    console.log(globals.API);
  }

}
