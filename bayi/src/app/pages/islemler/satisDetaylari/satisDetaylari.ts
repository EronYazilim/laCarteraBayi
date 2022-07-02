import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import Swal from 'sweetalert2/dist/sweetalert2'
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector : 'app-satisDetaylari',
    templateUrl : 'satisDetaylari.html',
    animations : [SharedAnimations]
})

export class satisDetaylariComponent implements OnInit {
    constructor(
        public islem : webServisIslemCalistir,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private bs: BreadcrumpService,
        private titleService: Title,
        private modalConfig: NgbModalConfig,
        private route: ActivatedRoute,
    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }
 
    ngOnInit() {
        this.titleService.setTitle("laCartera | Satış Detayları")
        this.bs.change(["İşlemler", "Satış İşlemleri", "Satış Detayları"])

        this.satisListele()
        console.log(this.route.snapshot.params)
    }

    modalHeader = { title: '' }

    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : this.route.snapshot.params.ID
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

    satisDetayAktarmaFormu = new FormGroup({
        islem               :   new FormControl(''),
        method              :   new FormControl(''),
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
    
    islemiKaydetBtn = false
    islemiKaydetBtn2 = false
    silinenKayitBtn = [false]
    secilenUrunBtn = [false]


    async satisListele() {
        this.mainLoader = true
        this.satisListesi = await this.islem.WebServisSorguSonucu("GET", "satisIslemleri/satisListesi", this.filterData)
        if (Object.keys(this.satisListesi).length == 0) { this.satisListesi = null}
        this.urunListele()
        this.detayFilterData.e_satis_unique_id = this.satisListesi[0].e_unique_id
        this.satisDetayListele()
        this.mainLoader = false
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
            ESKI_ID             :    this.route.snapshot.params.ID
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
            e_satis_unique_id   : this.satisListesi[0].e_unique_id,
            ESKI_ID             : '',
        })
        this.islemiKaydetDetayEkle()
    }

    async islemiKaydet(): Promise<void> {
        if (this.satisEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
          this.requestData = Object.assign({}, this.satisEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisListele()
            this.satisDetayListele()
            this.modalService.dismissAll()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          
          this.satisEklemeFormu.patchValue({
            e_odeme_tipi : ''
          })
          this.islemiKaydetBtn = false
        }
    }

    async islemiKaydetDetayEkle(): Promise<void> {
        if (this.satisDetayEklemeFormu.valid) {
          this.islemiKaydetBtn2 = true
    
          this.requestData = Object.assign({}, this.satisDetayEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
    
          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisDetayListele()
            // this.modalService.dismissAll()
            document.getElementById('detayKapatBtn').click()
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
            if (i > -1) {
            this.satisDetayListesi.splice(i, 1)
            if (this.satisDetayListesi.length == 0) { this.satisDetayListesi = null }
            }
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.silinenKayitBtn[secilenDetay.e_id] = false
        }
    }
    
}