import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import * as globals from '../globals'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  constructor(private http:HttpClient, private _notifications: NotificationsService) { }

  aule = [];
  roomReserv = {
    orario1 : "",
    orario2 : "",
    data: "",
    id_aula: "",
    professore: "",
    descrizione: "",
    token: globals.getToken()
  };
  data = "";

  ngOnInit() {
    this.http.get(globals.API + "aule").subscribe((data) => {
      this.aule = data["aule"];
    });
  }

  prenota() {
    console.log(this.roomReserv);

    if (this.data != null && this.data != "")
      this.roomReserv.data = this.data.replace(/-/g, "");
    else {
      console.log("errore: inserisci data!");
      return;
    }

    if (this.roomReserv.id_aula == null || this.roomReserv.id_aula == "") {
      console.log("errore: inserisci aula!");
      return;
    }

    if (this.roomReserv.orario1.substring(0, 2) >= this.roomReserv.orario2.substring(0, 2)) {
      /*
      this._notifications.error('Prenotazione', 'Intervallo di orario errato', {
        timeOut: 2000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true
      });
      */
      console.log("errore!");
      return;
    }

    // this._notifications.create("Prenotazione", "Prenotazione in corso...", success, 2000);
    console.log("prenotazione in corso");

    this.http.post(globals.API + "prenota", this.roomReserv).subscribe((data) => {
      console.log(data);
    });
  }

}
