import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import * as globals from "../globals";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(private http:HttpClient) { }

  weekDay = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  orari = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
  prenotazioni = [];
  prenotazioni_fill = [];

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  getSunday(d) {
    d = new Date(d);
    var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff+6));
  }
  
  fixNum(n) {
    if (n.toString().length == 1)
      return "0" + n.toString();
    
    return n.toString();
  }

  getFirstKey(o) {
    return Object.keys(o)[0];
  }

  convertStringToDate(d) {
    return d.substring(6, 8) + "/" + d.substring(4,6) + "/" + d.substring(0,4);
  }

  getDate(d) {
    let date = d.split("/");

    return this.weekDay[new Date(date[2], date[1] - 1, date[0]).getDay()];
  }

  ngOnInit() {

    var date = this.getMonday(new Date());
    var startWeek = date.getFullYear().toString() + this.fixNum(date.getMonth() + 1) + this.fixNum(date.getDate());

    var giorni = [];
    giorni.push(startWeek);

    var tmp = date;
    for (let i = 1; i < 7; i++) {
      tmp.setDate(tmp.getDate()+1);
      giorni.push(tmp.getFullYear().toString() + this.fixNum(tmp.getMonth() + 1) + this.fixNum(tmp.getDate()));
    }

    date = this.getSunday(new Date());
    var finishWeek = date.getFullYear().toString() + this.fixNum((date.getMonth() + 1)) + this.fixNum(date.getDate());

    this.http.get(globals.API + "aule").subscribe((data) => {

      var aule = data["aule"];

      this.http.get(globals.API + "prenotazioni?giorno1=" + startWeek + "&giorno2=" + finishWeek).subscribe((data) => {
        var pren = {};

        for (var g in giorni) {

          var val = giorni[g];
          pren[val] = [];

          for (var i in aule) {
            pren[val][i] = Object.assign([], aule[i]);

            if (pren[val][i].p == null)
              pren[val][i].p = [];

            var aulaSelected = false;

            for (var j in data["prenotazioni"]) {
              if (data["prenotazioni"][j].giorno == val && data["prenotazioni"][j].id_aula == pren[val][i].ID) {
                  aulaSelected = true;

                pren[val][i].p.push(data["prenotazioni"][j]);
              }
              else if (aulaSelected) {
                aulaSelected = false;
                break;
              }
            }

          }
        }

        var index = 0;
        for (var i in pren) {
          this.prenotazioni[index] = {};
          this.prenotazioni[index][i] = pren[i];

          for (var k = 0; k < pren[i].length; k++) {
            this.prenotazioni[index][i][k].prenotazioni_fill = [];

            for (let j = 0; j < 12; j++) {
              this.prenotazioni[index][i][k].prenotazioni_fill[j] = [];
              this.prenotazioni[index][i][k].prenotazioni_fill[j][0] = true;
              this.prenotazioni[index][i][k].prenotazioni_fill[j][1] = 1;
              this.prenotazioni[index][i][k].prenotazioni_fill[j][2] = "";
              this.prenotazioni[index][i][k].prenotazioni_fill[j][3] = false;
            }

            for (let j in this.prenotazioni[index][i][k].p) {
              let colspan = parseInt(this.prenotazioni[index][i][k].p[j].orario2.substring(0, 2)) - parseInt(this.prenotazioni[index][i][k].p[j].orario1.substring(0, 2))
              let tdIndex = parseInt(this.prenotazioni[index][i][k].p[j].orario1.substring(0, 2)) - 8;

              this.prenotazioni[index][i][k].prenotazioni_fill[tdIndex][0] = true;
              this.prenotazioni[index][i][k].prenotazioni_fill[tdIndex][1] = colspan;
              this.prenotazioni[index][i][k].prenotazioni_fill[tdIndex][2] = this.prenotazioni[index][i][k].p[j].descrizione + " (" + this.prenotazioni[index][i][k].p[j].professore + ")";
              this.prenotazioni[index][i][k].prenotazioni_fill[tdIndex][3] = true;

              for (let t = tdIndex+1; t < (tdIndex+colspan); t++) {
                this.prenotazioni[index][i][k].prenotazioni_fill[t][0] = false;
                this.prenotazioni[index][i][k].prenotazioni_fill[t][1] = 0;
              }

            }
          }

          index++;
        }
      });

    });

  }

}
