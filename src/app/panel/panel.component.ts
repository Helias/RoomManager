import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import * as globals from '../globals'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private http:HttpClient) { }

  aule = [];

  ngOnInit() {
    this.http.get(globals.API + "aule").subscribe((data) => {
      this.aule = data["aule"];
    });
  }

  prenota() {
      
  }

}
