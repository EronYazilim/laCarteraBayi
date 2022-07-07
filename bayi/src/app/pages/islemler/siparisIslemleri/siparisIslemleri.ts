import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import Swal from 'sweetalert2/dist/sweetalert2'
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';


@Component({
    selector: 'app-siparisIslemleri',
    templateUrl: './siparisIslemleri.html',
    animations: [SharedAnimations]
})

export class siparisIslemleriComponent implements OnInit {
    constructor(
        public islem : webServisIslemCalistir,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private bs: BreadcrumpService,
        private titleService: Title,
        private modalConfig: NgbModalConfig,
        private router: Router

    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }

    @ViewChild('modalSiparis') modalSiparis: ElementRef
    @ViewChild('modalSiparisDetay') modalSiparisDetay: ElementRef
    @ViewChild('modalUrun') modalUrun: ElementRef
  
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
        ARAMA   : '',
        SS      : '',
        KS      : '',
        e_durum : ''
    }

    siparisEklemeFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
        e_aciklama          :   new FormControl(''),
        e_durum             :   new FormControl(''),
        e_siparis_unique_id :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    siparisDetayAktarmaFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
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
    silinenKayitBtn = [false]
    secilenUrunBtn = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Sipariş İşlemleri")
        this.bs.change(["İşlemler", "Sipariş İşlemleri"])

        this.siparisListele()
        this.urunListele()
    }

    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
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

    siparisEkleButton() {
        this.router.navigateByUrl('/islemler/siparisEkle')
        // this.secilenKayit = null
        // this.siparisEklemeFormu.patchValue({
        //     islem               :   'siparisIslemleri/siparisEkle',
        //     method              :   'POST',
        //     e_odeme_tipi        :   '',
        //     e_aciklama          :   '',
        //     e_satis_unique_id   :   '',
        //     e_durum             :   'Aktif'
        // })
        // this.detayFilterData.e_siparis_unique_id = ''

        // this.siparisDetayListele()
        // this.modalHeader.title = 'Ekleme'
        // this.modalAc(this.modalSiparis, 'xl')
    }

    siparisDetayEkleButton() {
        this.siparisDetayEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisDetayEkle',
            method              :   'POST',
            e_stok_kart_id      :   '',
            e_stok_kart_adi     :   '',
            e_miktar            :   1,
            e_siparis_unique_id :   this.secilenKayit ? this.secilenKayit.e_unique_id : ""
        })
        this.modalHeader.title = 'Ekleme'
        this.modalAc(this.modalSiparisDetay, 'lg')
    }

    siparisDetayDuzenleButton(secilenKayit) {
        this.siparisDetayEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisDetayDuzenle',
            method              :   'PUT',
            e_stok_kart_id      :   secilenKayit.e_stok_kart_id,
            e_stok_kart_adi     :   secilenKayit.e_stok_kart_adi,
            e_miktar            :   secilenKayit.e_miktar,
            e_siparis_unique_id :   secilenKayit.e_siparis_unique_id,
            ESKI_ID             :   secilenKayit.e_id
        })
        this.modalHeader.title = 'Düzenleme'
        this.modalAc(this.modalSiparisDetay, 'lg')
    }

    async siparisDuzenleButton(secilenKayit) {
        this.siparisEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisDuzenle',
            method              :   'PUT',
            e_aciklama          :   secilenKayit.e_aciklama,
            e_durum             :   secilenKayit.e_durum,
            e_siparis_unique_id :   secilenKayit.e_unique_id,
            ESKI_ID             :   secilenKayit.e_id,
        })
        this.siparisDetayAktarmaFormu.patchValue({
            islem               : 'siparisIslemleri/siparisDetayAktar',
            method              : 'POST',
            e_siparis_unique_id : secilenKayit.e_unique_id,
            ESKI_ID             : secilenKayit.e_id
        })
        this.detayFilterData.e_siparis_unique_id = secilenKayit.e_unique_id
        this.requestData = Object.assign({}, this.siparisDetayAktarmaFormu.value)
        this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
        this.secilenKayit = secilenKayit
        this.modalHeader.title = 'Düzenleme'
        await this.siparisDetayListele()
        this.modalAc(this.modalSiparis, 'xl')
    }    

    async islemiKaydet(): Promise<void> {
        if (this.siparisEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
            if (this.siparisDetayListesi == null) {
                this.toastr.error("Lütfen Ürün Ekleyiniz!", 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
                this.islemiKaydetBtn = false
                return
            }

          this.requestData = Object.assign({}, this.siparisEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
    
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.siparisListele()
            this.modalService.dismissAll()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          
          this.islemiKaydetBtn = false
        }
    }

    async islemiKaydetDetayEkle(): Promise<void> {
        if (this.siparisDetayEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
          this.requestData = Object.assign({}, this.siparisDetayEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
    
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.siparisDetayListele()
            // this.modalService.dismissAll()
            document.getElementById('detayKapatBtn').click()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
    
          this.islemiKaydetBtn = false
        }
    }
    
    silButton(secilenKayit, islem) {
    Swal.fire({
        title: 'Sipariş Silinecek!',
        text: "Siparişi sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
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
            this.detayKayitSil(secilenDetay, islem)
            }
        })
    }

    async kayitSil(secilenKayit, islem): Promise<void> {
        this.silinenKayitBtn[secilenKayit.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKayit.e_id })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            const i = this.siparisListesi.indexOf(secilenKayit)
            if (i > -1) {
            this.siparisListesi.splice(i, 1)
            if (this.siparisListesi.length == 0) { this.siparisListesi = null }
            }
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.silinenKayitBtn[secilenKayit.e_id] = false
        }
    }

    async detayKayitSil(secilenDetay, islem): Promise<void> {
        this.silinenKayitBtn[secilenDetay.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenDetay.e_id })

        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            const i = this.siparisDetayListesi.indexOf(secilenDetay)
            if (i > -1) {
            this.siparisDetayListesi.splice(i, 1)
            if (this.siparisDetayListesi.length == 0) { this.siparisDetayListesi = null }
            }
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.silinenKayitBtn[secilenDetay.e_id] = false
        }
    }

    urunListesiAc() {
        this.modalAc(this.modalUrun, 'xl')
    }

    async urunSec(secilenUrun) {
        this.secilenUrunBtn[secilenUrun.e_id] = true
        this.siparisDetayEklemeFormu.patchValue({
            e_stok_kart_adi : secilenUrun.e_stok_kart_adi,
            e_stok_kart_id : secilenUrun.e_id
        })
        console.log(this.siparisDetayEklemeFormu.value.e_stok_kart_adi)
        console.log(this.siparisDetayEklemeFormu.value.e_id)
        document.getElementById("modalUrunKpt").click()
        this.secilenUrunBtn[secilenUrun.e_id] = false
    }

    detayMiktarDuzenle(miktar) {
        let element =  (document.getElementById('miktarInput') as HTMLInputElement)

        if (miktar == '-') {
            this.siparisDetayEklemeFormu.controls.e_miktar.setValue(String(Number(element.value) - 1))
        } else {
            this.siparisDetayEklemeFormu.controls.e_miktar.setValue(String(Number(element.value) + 1))
        }
    }

}