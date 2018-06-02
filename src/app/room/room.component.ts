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

  orari = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
  aule = [];
  giorni = [];

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

      this.aule = data["aule"];

      this.http.get(globals.API + "prenotazioni?giorno1=" + startWeek + "&giorno2=" + finishWeek).subscribe((data) => {
        let pren = [];

        for (var i in this.aule) {
          this.aule[i].p = [];

          var aulaSelected = false;

          for (let j in data["prenotazioni"]) {
            if (data["prenotazioni"][j].id_aula == this.aule[i].ID) {
              aulaSelected = true;

              this.aule[i].p.push(data["prenotazioni"][j]);
            }
            else if (aulaSelected) {
              aulaSelected = false;
              break;
            }
          }
        }
        console.log(this.aule);
      });

    });

  }

}
