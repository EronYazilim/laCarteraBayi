import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { AuthenticationService } from '../../core/services/auth.service'
import { webServisIslemCalistir } from '../../ISLEM'
import { ToastrService } from 'ngx-toastr'
import { Title } from '@angular/platform-browser'
import { LocalStoreService } from "../../core/services/local-store.service"

@Component({
  selector: 'app-giris',
  templateUrl: './giris.html'  
})

export class girisComponent implements OnInit {
  constructor(
    public authenticationService: AuthenticationService,
    private islem : webServisIslemCalistir,
    private toastr: ToastrService,
    private titleService: Title,
    private store: LocalStoreService
  ) { }

  ngOnInit() {
    this.titleService.setTitle("laCartera | Giriş")

    document.body.removeAttribute('data-layout')
    document.body.classList.add('auth-body-bg')

    this.girisFormu.reset()

		if (this.store.getItem("laCartera_bayi_e_kull_adi") != '') {
			this.girisFormu.patchValue({
				e_kull_adi	: this.store.getItem("laCartera_bayi_e_kull_adi"),
				e_beni_hatirla	: true,
			})
		}
  }

  requestData
  responseData

  girisFormu = new FormGroup ({
		e_mail_adresi	: new FormControl(''),
		e_sifre					: new FormControl(''),
		e_beni_hatirla	: new FormControl(''),
  })
  girisYapBtn = false

  async girisYap() {
    if (!this.girisFormu.invalid) {
      this.girisYapBtn = true
      this.requestData = Object.assign({}, this.girisFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucu("POST", "authentication/login", this.requestData)    

      if (this.responseData.BAGLANTI_HATASI) {
        this.girisYapBtn = false
        return null
      }

      if (this.responseData[0].S == "T") {
        this.authenticationService.login(this.responseData[0])

        if (this.requestData.e_beni_hatirla == true) {
          this.store.setItem("laCartera_bayi_e_kull_adi", this.requestData.e_kull_adi)
        } else {
          this.store.setItem("laCartera_bayi_e_kull_adi", "")
        }

        window.location.href = './anasayfa'
      } else {
        this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'Giriş Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.authenticationService.logout()
        this.requestData.e_sifre = ""
      }

      this.girisYapBtn = false
    }
  }
}