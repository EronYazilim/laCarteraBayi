import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import Swal from 'sweetalert2/dist/sweetalert2'

@Component({
    selector: 'app-kullaniciKayitlari',
    templateUrl: './kullaniciKayitlari.html',
    animations: [SharedAnimations]
})

export class kullaniciKayitlariComponent implements OnInit {
  constructor(
    public islem : webServisIslemCalistir,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private bs: BreadcrumpService,
    private titleService: Title,
    private modalConfig: NgbModalConfig
  ) { 
    modalConfig.backdrop = 'static'
    modalConfig.keyboard = false
    modalConfig.size = 'sm'
  }
          
  @ViewChild('modalkullaniciTanimlari') modalkullaniciTanimlari: ElementRef

  modalHeader = { title: '' }

  kullaniciTanimlariFormu = new FormGroup({
      islem           : new FormControl(''),
      method          : new FormControl(''),
      e_kull_adi      : new FormControl(''),
      e_sifre         : new FormControl(''),
      e_durum         : new FormControl(''),
      ESKI_ID         : new FormControl(''),
  })

  filterData = {
  ARAMA   : '',
  SS      : 1,
  KS      : 15,
  e_durum : ''
  }

  requestData
  responseData
  mainLoader = false

  kullaniciTanimlari

  islemiKaydetBtn = false
  silinenKayitBtn = [false]

  ngOnInit() {
    this.titleService.setTitle("laCartera | Kullanıcılar")
    this.bs.change(["Kayıtlar", "Kullanıcı Kayıtları"])

    this.kullaniciTanimlariListele()
  }

  modalAc(content, size) {
  this.modalConfig.size = size
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }

  async kullaniciTanimlariListele(): Promise<void> {
    this.mainLoader = true
    this.kullaniciTanimlari = await this.islem.WebServisSorguSonucu("GET", "kullaniciIslemleri/kullaniciListesi", this.filterData)
    if (Object.keys(this.kullaniciTanimlari).length == 0) { this.kullaniciTanimlari = null }
    this.mainLoader = false
  }
  
  ekleButton() {
    this.kullaniciTanimlariFormu.patchValue({
      islem           :'kullaniciIslemleri/kullaniciEkle',
      method          :'POST',
      e_kull_adi      : '',
      e_sifre         : '',
      e_durum         : ''
    })
    this.modalHeader.title = 'Yeni Kullanıcı Ekleme Formu'
    this.modalAc(this.modalkullaniciTanimlari, 'md')
  }

  duzenleButton(secilenKayit) {
    this.kullaniciTanimlariFormu.patchValue({
      islem             : 'kullaniciIslemleri/kullaniciDuzenle',
      method            : 'PUT',
      e_kull_adi        : secilenKayit.e_kull_adi,
      e_sifre           : secilenKayit.e_sifre,
      e_durum           : secilenKayit.e_durum,
      ESKI_ID           : secilenKayit.e_id
    })
    this.modalHeader.title = 'Kullanıcı Düzenleme Formu'
    this.modalAc(this.modalkullaniciTanimlari, 'md')
  }

  async islemiKaydet(): Promise<void> {
    if (this.kullaniciTanimlariFormu.valid) {
      this.islemiKaydetBtn = true

      this.requestData = Object.assign({}, this.kullaniciTanimlariFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

      if (this.responseData[0].S == "T") {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.kullaniciTanimlariListele()
        this.modalService.dismissAll()
      } else {
        this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
      }

      this.islemiKaydetBtn = false
    }
  }

  silButton(secilenKayit, islem) {
    Swal.fire({
      title: 'Kullanıcı Silinecek!',
      text: "Kullanıcıyı sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      confirmButtonColor: '#c49c5c',
      cancelButtonText: 'İptal',
      cancelButtonColor: '#222'
    }).then((result) => {
      if (result.isConfirmed) {
        this.kayitSil(secilenKayit, islem)
      }
    })
  }

  async kayitSil(secilenKayit, islem): Promise<void> {
    this.silinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKayit.e_id })

    if ((this.responseData[0].S) == "T") {
      this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
      const i = this.kullaniciTanimlari.indexOf(secilenKayit)
      if (i > -1) {
        this.kullaniciTanimlari.splice(i, 1)
        if (this.kullaniciTanimlari.length == 0) { this.kullaniciTanimlari = null }
      }
    } else {
      this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
      this.silinenKayitBtn[secilenKayit.e_id] = false
    }
  }
    
}