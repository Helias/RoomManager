import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as globals from "../globals";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  g = globals;

  loggingOut() {
    globals.logout();
    this.router.navigate(['login']);
  }

}
