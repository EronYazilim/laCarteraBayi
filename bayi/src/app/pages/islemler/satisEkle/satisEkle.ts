import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import Swal from 'sweetalert2/dist/sweetalert2'
import { FormGroup, FormControl } from "@angular/forms";

@Component({
    selector: 'app-satisEkle',
    templateUrl: './satisEkle.html',
    animations: [SharedAnimations]
})

export class satisEkleComponent implements OnInit {
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

    modalHeader = { title: '' }

    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    detayFilterData = {
        e_satis_unique_id   : ''
    }

    urunFilterData = {
        ARAMA       : '',
        SS          : '',
        KS          : '',
        e_durum     : '',
        e_cinsiyet  : ''
    }
    
    satisEklemeFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
        e_odeme_tipi        :   new FormControl(''),
        e_satis_unique_id   :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    satisDetayEklemeFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
        e_stok_kart_id      :   new FormControl(''),
        e_stok_kart_adi     :   new FormControl(''),
        e_miktar            :   new FormControl(''),
        e_satir_toplami     :   new FormControl(''),
        e_satis_id          :   new FormControl(''),
        e_satis_unique_id   :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    requestData
    responseData
    mainLoader = false
    detayLoader = false
    urunLoader = false
    
    satisListesi
    satisDetayListesi
    urunListesi
    secilenKayit
    odemeTipi
    
    islemiKaydetBtn = false
    islemiKaydetBtn2 = false
    silinenKayitBtn = [false]
    secilenUrunBtn = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Satış Ekle")
        this.bs.change(["İşlemler", "Satış İşlemleri", "Satış Ekle"])

        this.urunListele()
        this.satisDetayListele()
    }
    
    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }
    
    async satisDetayListele() {
        this.detayLoader = true
        this.satisDetayListesi = await this.islem.WebServisSorguSonucu("GET", "satisIslemleri/satisDetayListesi", this.detayFilterData)
        if (Object.keys(this.satisDetayListesi).length == 0) { this.satisDetayListesi = null}
        this.detayLoader = false
    }

    async urunListele() {
        this.urunLoader = true
        this.urunListesi = await this.islem.WebServisSorguSonucu("GET", "stokKartIslemleri/stokKartListesi", this.urunFilterData)
        if (Object.keys(this.urunListesi).length == 0) { this.urunListesi = null}
        this.urunLoader = false
    }

    satisEkle() {
        this.satisEklemeFormu.patchValue({
            islem               :    'satisIslemleri/satisEkle',
            method              :    'POST',
            e_satis_unique_id   :    '',
            ESKI_ID             :    ''
        })
    }

    sepeteEkle(secilenUrun) {
        this.satisDetayEklemeFormu.patchValue({
            islem               : 'satisIslemleri/satisDetayEkle',
            method              : 'POST',
            e_stok_kart_id      : secilenUrun.e_id,
            e_stok_kart_adi     : secilenUrun.e_stok_kart_adi,
            e_miktar            : secilenUrun.e_miktar,
            e_satir_toplami     : '',
            e_satis_id          : '',
            e_satis_unique_id   : '',
            ESKI_ID             : '',
        })
        this.islemiKaydetDetayEkle()
    }

    kaydetButton() {
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

    async islemiKaydet(): Promise<void> {
        if (this.satisEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
        if (this.odemeTipi != 'Nakit' && this.odemeTipi != 'Kredi Kartı') {
            this.toastr.error('Ödeme Tipi Seçiniz!', 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.islemiKaydetBtn = false
            return
        }

        if (this.satisDetayListesi == null) {
            this.toastr.error('Sepete Ürün Ekleyiniz!', 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            return
        }

          this.requestData = Object.assign({}, this.satisEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
            console.log(this.responseData)
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.urunFilterData.e_cinsiyet = 'Erkek'
            this.urunListele()
            this.satisDetayListele()
            this.modalService.dismissAll()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          
          this.odemeTipi = ''
          this.islemiKaydetBtn = false
        }
    }

    async islemiKaydetDetayEkle(): Promise<void> {
        if (this.satisDetayEklemeFormu.valid) {
          this.islemiKaydetBtn2 = true
          this.requestData = Object.assign({}, this.satisDetayEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
    
          if (this.responseData[0].S == "T") {
            // this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisDetayListele()
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
            title: 'Satış Detayı Silinecek!',
            text: "Satış detayını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            confirmButtonColor: '#c49c5c',
            cancelButtonText: 'İptal',
            cancelButtonColor: '#222'
        }).then((result) => {
            if (result.isConfirmed) {
            this.satisDetaySil(secilenDetay, islem)
            }
        })
    }

    async satisDetaySil(secilenDetay, islem) {
        this.silinenKayitBtn[secilenDetay.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenDetay.e_id })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            const i = this.satisDetayListesi.indexOf(secilenDetay)
            this.satisDetayListele()
            if (i > -1) {
            this.satisDetayListesi.splice(i, 1)
            if (this.satisDetayListesi.length == 0) { this.satisDetayListesi = null }
            }
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.silinenKayitBtn[secilenDetay.e_id] = false
        }
    }

    odemeTipiSec() {
        if (this.odemeTipi == 'Nakit') {
            this.satisEklemeFormu.patchValue({
                e_odeme_tipi : 'Nakit'
            })
        } else if (this.odemeTipi == 'Kredi Kartı') {
            this.satisEklemeFormu.patchValue({
                e_odeme_tipi : 'Kredi Kartı'
            })
        } else if (this.odemeTipi == '') {
            this.satisEklemeFormu.patchValue({
                e_odeme_tipi : ''
            })
        }
        console.log(this.satisEklemeFormu.value.e_odeme_tipi)
    }

    async detayMiktarDuzenle(secilenDetay, miktar) {
        this.requestData = {
            islem           : 'satisIslemleri/satisDetayDuzenle',
            method          : 'PUT',
            e_stok_kart_id  :   secilenDetay.e_stok_kart_id,
            e_miktar        :   secilenDetay.e_miktar + miktar,
            e_satir_toplami :   secilenDetay.e_satir_toplami + (miktar * secilenDetay.e_birim_fiyat),
            ESKI_ID         :   secilenDetay.e_id
        }
        this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
        secilenDetay.e_miktar = this.requestData.e_miktar
        secilenDetay.e_satir_toplami = this.requestData.e_satir_toplami
        // this.satisDetayListele() 
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
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", "satisIslemleri/satisDetayTemizle", { e_satis_unique_id : '' })
        
        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisDetayListele()
            this.odemeTipi = ''
            this.urunFilterData.e_cinsiyet = 'Erkek'
            this.urunListele()
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
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", "satisIslemleri/satisDetayTemizle", { e_satis_unique_id : '' })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisDetayListele()
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        }
    }
}