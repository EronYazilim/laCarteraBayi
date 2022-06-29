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
        private modalConfig: NgbModalConfig
    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }

    @ViewChild('modalSiparis') modalSiparis: ElementRef
    @ViewChild('modalSiparisDetay') modalSiparisDetay: ElementRef
  
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
        e_miktar            :   new FormControl(''),
        e_siparis_unique_id :   new FormControl(''),
        ESKI_ID             :   new FormControl('')
    })

    requestData
    responseData
    mainLoader = false
    detayLoader = false
    
    siparisListesi
    siparisDetayListesi
    secilenKayit
    
    islemiKaydetBtn = false
    silinenKayitBtn = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Sipariş İşlemleri")
        this.bs.change(["İşlemler", "Sipariş İşlemleri"])

        this.siparisListele()
        this.siparisDetayListele()
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

    siparisEkleButton() {
        this.siparisEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisEkle',
            method              :   'POST',
            e_aciklama          :   '',
            e_siparis_unique_id :   '',
            e_durum             :   ''
        })
        this.siparisDetayListele()
        this.modalHeader.title = 'Yeni Sipariş Ekleme Formu'
        this.modalAc(this.modalSiparis, 'md')
    }

    siparisDetayEkleButton() {
        this.siparisDetayEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisDetayEkle',
            method              :   'POST',
            e_stok_kart_id      :   '',
            e_miktar            :   '',
            e_siparis_unique_id :   this.secilenKayit.e_unique_id
        })
        this.modalHeader.title = 'Sipariş Detay Ekleme Formu'
        this.modalAc(this.modalSiparisDetay, 'md')
    }

    siparisDetayDuzenleButton(secilenKayit) {
        this.siparisDetayEklemeFormu.patchValue({
            islem               :   '',
            method              :   '',
            e_stok_kart_id      :   '',
            e_miktar            :   '',
            e_siparis_unique_id :   secilenKayit.e_siparis_unique_id,
            ESKI_ID             :   ''
        })
    }

    async islemiKaydet(): Promise<void> {
        if (this.siparisEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
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

    async siparisDuzenleButton(secilenKayit) {
        this.siparisEklemeFormu.patchValue({
            islem               :   'siparisIslemleri/siparisDuzenle',
            method              :   'PUT',
            e_aciklama          :   secilenKayit.e_aciklama,
            e_durum             :   secilenKayit.e_durum,
            e_siparis_unique_id :   secilenKayit.e_siparis_unique_id,
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
        this.modalHeader.title = 'Sipariş Düzenleme Ekleme Formu'
        this.modalAc(this.modalSiparis, 'md')
    }
    
}