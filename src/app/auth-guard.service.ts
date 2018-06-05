import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router }         from '@angular/router';
import * as globals       from './globals';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {

        if (!globals.isLogged())
            this.router.navigate(['login']);

        return true;
    }
}
