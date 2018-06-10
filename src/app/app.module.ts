import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AuthGuard } from './auth-guard.service';
import * as globals from "./globals";

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { ContattiComponent } from './contatti/contatti.component';
import { RoomComponent } from './room/room.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  { path: '',         component: RoomComponent },
  { path: 'aule',     component: RoomComponent },
  { path: 'admin',    component: PanelComponent, canActivate:[AuthGuard] },
  { path: 'contatti', component: ContattiComponent },
  { path: 'login',    component: LoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ContattiComponent,
    RoomComponent,
    PanelComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    BsDropdownModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
