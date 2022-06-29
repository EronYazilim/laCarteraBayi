import { Injectable } from "@angular/core"
import { LocalStoreService } from "./local-store.service"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { delay } from "rxjs/operators"

@Injectable({
  providedIn: "root"
})

export class AuthenticationService {
  authenticated = false
  
  constructor (
    private store: LocalStoreService,
    private router: Router
  ) {
    this.checkAuth()
  }

  checkAuth() {
    if (this.store.getItem("laCartera_bayi_kullanici_token") == "") {
      this.authenticated = false
    } else {
      this.authenticated = true
    }
  }

  getuser() {
    return of ({})
  }

  login(credentials) {
    this.authenticated = true
    this.store.setItem("laCartera_bayi_kullanici_token", credentials.UTOKEN)
    this.store.setItem("e_kull_adi", credentials.e_kull_adi)
    this.store.setItem("PID", credentials.PID)
    return of({}).pipe(delay(1500))
  }

  logout() {
    this.authenticated = false
    this.store.setItem("laCartera_bayi_kullanici_token", "")
    this.store.setItem("e_kull_adi", "")
    this.store.setItem("PID", "")
    this.router.navigateByUrl("/giris")
  }
}