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
    if (this.data != null && this.data != "")
      this.roomReserv.data = this.data.replace(/-/g, "");
    else {
      console.log("errore: inserisci data!");
      this._notifications.create("Prenotazione", "Inserisci la data!", "error", globals.confNotifications);
      return;
    }

    if (this.roomReserv.id_aula == null || this.roomReserv.id_aula == "") {
      this._notifications.create("Prenotazione", "Inserisci l'aula!", "error", globals.confNotifications);
      return;
    }

    if (this.roomReserv.orario1.substring(0, 2) >= this.roomReserv.orario2.substring(0, 2)) {
      this._notifications.create('Prenotazione', 'Intervallo di orario errato', 'error', globals.confNotifications);
      return;
    }

    this._notifications.create("Prenotazione", "Prenotazione in corso...", "success", globals.confNotifications);

    this.http.post(globals.API + "prenota", this.roomReserv).subscribe((data) => {
    });
  }

}
