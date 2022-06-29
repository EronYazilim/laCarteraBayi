import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import { AuthenticationService } from '../../../core/services/auth.service'
import { LocalStoreService } from "../../../core/services/local-store.service"
import { BreadcrumpService } from '../../../core/services/breadcrump.service'
import { webServisIslemCalistir } from '../../../ISLEM'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, FormControl } from '@angular/forms'
import Swal from 'sweetalert2/dist/sweetalert2'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})

export class TopbarComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private auth: AuthenticationService,
    public cookiesService: CookieService,
    private store: LocalStoreService,
    private bs: BreadcrumpService,
    private islem : webServisIslemCalistir,
    private modalService: NgbModal,
    public modalConfig: NgbModalConfig,
    private toastr: ToastrService
  ) {
    modalConfig.backdrop = 'static'
    modalConfig.keyboard = false
    modalConfig.size = 'sm'
  }

  @Output() mobileMenuButtonClicked = new EventEmitter()
  
  @ViewChild('modalSifreGuncelleme') modalSifreGuncelleme: ElementRef

  ngOnInit(): void {
    this.loginOlanKullaniciAdi = this.store.getItem("e_personel_adi")
    this.bs.getBreadcrumpValue().subscribe(item => this.breadcrump = item)
    this.bs.getBaslikValue().subscribe(item => this.anaBaslik = item)

    this.element = document.documentElement
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    }
  }

  modalAc(content, size) {
    this.modalConfig.size = size
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }

  element: any
  configData: any
  loginOlanKullaniciAdi = ""
  breadcrump
  anaBaslik
  logoutDegiskeni

  sifreGuncellemeFormu = new FormGroup({
    islem           : new FormControl(''),
    e_eski_sifre    : new FormControl(''),
    e_sifre         : new FormControl(''),
    e_sifre_tekrar  : new FormControl('')
  })
  sifreGuncellemeBtn

  requestData
  responseData

  toggleMobileMenu(event: any) {
    event.preventDefault()
    this.mobileMenuButtonClicked.emit()
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable')
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen()
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen()
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen()
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen()
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen()
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen()
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen()
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen()
      }
    }
  }
  
  logout() {
    Swal.fire({
      title: 'Dikkat !',
      text: "Sistemden çıkış yapılacak, emin misiniz ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Çık',
      confirmButtonColor: '#E20D71',
      cancelButtonText: 'İptal',
      cancelButtonColor: '#222'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.logoutDegiskeni = await this.islem.WebServisSorguSonucu("POST", "authentication/logout", {})
        if (Object.keys(this.logoutDegiskeni).length == 0) { this.logoutDegiskeni = null }
        if(this.logoutDegiskeni[0].S == "T") {
          this.auth.logout()
        } else if(this.logoutDegiskeni[0].HATA_ACIKLAMASI) {
          this.toastr.error(this.logoutDegiskeni[0].HATA_ACIKLAMASI, 'İşlem Başarısız', {
            timeOut: 5000,
            closeButton: false,
            progressBar: true
          })
        } else {
          this.toastr.error('Güvenli Çıkış Yapılamadı', 'İşlem Başarısız', {
            timeOut: 5000,
            closeButton: false,
            progressBar: true
          })
        }
      }
    })
  }

  sifreGuncellemeButton() {
    this.sifreGuncellemeFormu.patchValue({
      islem           : 'KULLANICI_KAYITLARI_SIFRE_DUZENLE',
      e_eski_sifre    : '',
      e_sifre         : '',
      e_sifre_tekrar  : '',
    })
    this.modalAc(this.modalSifreGuncelleme, 'md')
  }

	sifreGuncellemeKaydet() {
    if (!this.sifreGuncellemeFormu.invalid) {
      var data = Object.assign({}, this.sifreGuncellemeFormu.value)

			if (data.e_sifre != data.e_sifre_tekrar) {
				this.toastr.error('', 'Lütfen girilen şifrelerin aynı olduğuna emin olun!', { timeOut: 3000, closeButton: true, progressBar: true })
			} else {
				Swal.fire({
					title: 'Şifreniz Güncellenecek!',
					text: "Şifrenizi güncellemek istediğinize emin misiniz ?",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Evet, Güncelle',
					confirmButtonColor: '#E20D71',
					cancelButtonText: 'İptal',
					cancelButtonColor: '#222'
				}).then((result) => {
					if (result.isConfirmed) {
						this.sifreGuncelleme()
					}
				})
			}
    }
  }

  async sifreGuncelleme(): Promise<void> {
    if (this.sifreGuncellemeFormu.valid) {
      this.sifreGuncellemeBtn = true

      this.requestData = Object.assign({}, this.sifreGuncellemeFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucu("kullaniciKayitlari", this.requestData.islem, this.requestData)

      if (this.responseData[0].S == "T") {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.modalService.dismissAll()
      } else {
        this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
      }

      this.sifreGuncellemeBtn = false
    }
  }
}