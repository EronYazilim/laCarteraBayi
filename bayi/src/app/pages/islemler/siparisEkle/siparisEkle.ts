import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import Swal from 'sweetalert2/dist/sweetalert2'
import { FormGroup, FormControl } from "@angular/forms";
import { Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-siparisEkle',
    templateUrl: './siparisEkle.html',
    animations: [SharedAnimations]
})

export class siparisEkleComponent implements OnInit {
    constructor(
        public islem : webServisIslemCalistir,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private bs: BreadcrumpService,
        private titleService: Title,
        private modalConfig: NgbModalConfig,
        private readonly meta: Meta
    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }

    modalHeader = { title: '' }

    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    detayFilterData = {
        e_siparis_unique_id   : ''
    }

    urunFilterData = {
        ARAMA       : '',
        SS          : '',
        KS          : '',
        e_durum     : '',
        e_cinsiyet  : 'Erkek'
    }

    siparisEklemeFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
        e_aciklama          :   new FormControl(''),
        e_durum             :   new FormControl(''),
        e_siparis_unique_id :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    siparisDetayEklemeFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
        e_stok_kart_id      :   new FormControl(''),
        e_stok_kart_adi     :   new FormControl(''),
        e_miktar            :   new FormControl(''),
        e_siparis_unique_id :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    requestData
    responseData
    mainLoader = false
    detayLoader = false
    urunLoader = false
    
    siparisListesi
    siparisDetayListesi
    urunListesi
    secilenKayit
    
    islemiKaydetBtn = false
    islemiKaydetBtn2 = false
    silinenKayitBtn = [false]
    secilenUrunBtn = [false]

    ngOnInit() {

        this.meta.addTag({ name: 'viewport', content: 'width=1920' })

        this.titleService.setTitle("laCartera | Sipariş Ekle")
        this.bs.change(["İşlemler", "Sipariş İşlemleri", "Sipariş Ekle"])

        this.urunListele()
        this.siparisDetayListele()
    }

    async siparisListele() {
        this.mainLoader = true
        this.siparisListesi = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisListesi", this.filterData)
        if (Object.keys(this.siparisListesi).length == 0) { this.siparisListesi = null}
        this.mainLoader = false
    }

    async siparisDetayListele() {
        this.detayLoader = true
        this.siparisDetayListesi = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisDetayListesi", this.detayFilterData)
        if (Object.keys(this.siparisDetayListesi).length == 0) { this.siparisDetayListesi = null}
        this.detayLoader = false
    }

    async urunListele() {
        this.urunLoader = true
        this.urunListesi = await this.islem.WebServisSorguSonucu("GET", "stokKartIslemleri/stokKartListesi", this.urunFilterData)
        if (Object.keys(this.urunListesi).length == 0) { this.urunListesi = null}
        this.urunLoader = false
    }
  
    siparisEkle() {
        this.siparisEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisEkle',
            method              :   'POST',
            e_durum             :   'Aktif',
            siparis_unique_id   :   '',
            ESKI_ID             :   ''
        })
    }

    sepeteEkle(secilenUrun) {
        this.siparisDetayEklemeFormu.patchValue({
            islem               : 'siparisIslemleri/siparisDetayEkle',
            method              : 'POST',
            e_stok_kart_id      : secilenUrun.e_id,
            e_stok_kart_adi     : secilenUrun.e_stok_kart_adi,
            e_miktar            : secilenUrun.e_miktar,
            e_siparis_unique_id : '',
            ESKI_ID             : '',
        })
        this.islemiKaydetDetayEkle()
    }
    
    kaydetButton() {
        if (this.siparisDetayListesi == null) {
            this.toastr.error('Sepete Ürün Ekleyiniz!', 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            return
        } else {
            Swal.fire({
                title: 'Satış Kaydedilecek!',
                text: "Satışı kaydetmek istediğinize emin misiniz ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Kaydet',
                confirmButtonColor: '#c49c5c',
                cancelButtonText: 'İptal',
                cancelButtonColor: '#222'
            }).then((result) => {
                if (result.isConfirmed) {
                this.islemiKaydet()
                }
            })
        }
        
    }

    async islemiKaydet(): Promise<void> {
        if (this.siparisEklemeFormu.valid) {
          this.islemiKaydetBtn = true

          this.requestData = Object.assign({}, this.siparisEklemeFormu.value)
          console.log(this.requestData)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
            console.log(this.responseData)
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.urunFilterData.e_cinsiyet = 'Erkek'
            this.urunListele()
            this.siparisDetayListele()
            this.modalService.dismissAll()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          
          this.islemiKaydetBtn = false
        }
    }

    async islemiKaydetDetayEkle(): Promise<void> {
        if (this.siparisDetayEklemeFormu.valid) {
          this.islemiKaydetBtn2 = true
          this.requestData = Object.assign({}, this.siparisDetayEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
    
          if (this.responseData[0].S == "T") {
            // this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.siparisDetayListele()
            // this.modalService.dismissAll()
            // document.getElementById('detayKapatBtn').click()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          this.islemiKaydetBtn2 = false
        }
    }
    
    detaySilButton(secilenDetay, islem) {
        Swal.fire({
            title: 'Sipariş Detayı Silinecek!',
            text: "Sipariş detayını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            confirmButtonColor: '#c49c5c',
            cancelButtonText: 'İptal',
            cancelButtonColor: '#222'
        }).then((result) => {
            if (result.isConfirmed) {
            this.siparisDetaySil(secilenDetay, islem)
            }
        })
    }

    async siparisDetaySil(secilenDetay, islem) {
        this.silinenKayitBtn[secilenDetay.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenDetay.e_id })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            const i = this.siparisDetayListesi.indexOf(secilenDetay)
            this.siparisDetayListele()
            if (i > -1) {
            this.siparisDetayListesi.splice(i, 1)
            if (this.siparisDetayListesi.length == 0) { this.siparisDetayListesi = null }
            }
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.silinenKayitBtn[secilenDetay.e_id] = false
        }
    }

    async detayMiktarDuzenle(secilenDetay, miktar) {
        this.requestData = {
            islem           : 'siparisIslemleri/siparisDetayDuzenle',
            method          : 'PUT',
            e_stok_kart_id  :   secilenDetay.e_stok_kart_id,
            e_miktar        :   secilenDetay.e_miktar + miktar,
            ESKI_ID         :   secilenDetay.e_id
        }
        this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
        secilenDetay.e_miktar = this.requestData.e_miktar
        // this.siparisDetayListele()
    }
    
    sayfayiTemizleButton() {
        Swal.fire({
            title: 'Sayfa Yenilenecek!',
            text: "Sayfayı yenilemek istediğinize emin misiniz ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yenile',
            confirmButtonColor: '#c49c5c',
            cancelButtonText: 'İptal',
            cancelButtonColor: '#222'
        }).then((result) => {
            if (result.isConfirmed) {
            this.sayfayiTemizle()
            }
        })
    }

    async sayfayiTemizle() {
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", "siparisIslemleri/siparisDetayTemizle", { e_siparis_unique_id : '' })
        
        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.urunFilterData.e_cinsiyet = 'Erkek'
            this.urunListele()
            this.siparisDetayListele()
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        }
    }

    sepetiTemizleButton() {
        Swal.fire({
            title: 'Sepet Temizlenecek!',
            text: "Sepeti temizlemek istediğinize emin misiniz ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Temizle',
            confirmButtonColor: '#c49c5c',
            cancelButtonText: 'İptal',
            cancelButtonColor: '#222'
        }).then((result) => {
            if (result.isConfirmed) {
            this.sepetiTemizle()
            }
        })
    }
    
    async sepetiTemizle() {
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", "siparisIslemleri/siparisDetayTemizle", { e_siparis_unique_id : '' })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.siparisDetayListele()
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        }
    }
}