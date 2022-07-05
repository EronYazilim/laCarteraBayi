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
    selector: 'app-satisIslemleri',
    templateUrl: './satisIslemleri.html',
    animations: [SharedAnimations]
})

export class satisIslemleriComponent implements OnInit {
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

    @ViewChild('modalSatis') modalSatis: ElementRef
    @ViewChild('modalSatisDetay') modalSatisDetay: ElementRef
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
        e_satis_unique_id   : ''
    }

    urunFilterData = {
        ARAMA   : '',
        SS      : '',
        KS      : '',
        e_durum : ''
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
    secilenDetay
    secilenDetay2
    odemeTipi
    
    islemiKaydetBtn = false
    islemiKaydetBtn2 = false
    silinenKayitBtn = [false]
    secilenUrunBtn = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Satış İşlemleri")
        this.bs.change(["İşlemler", "Satış İşlemleri"])

        this.satisListele()
        this.urunListele()
    }

    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }
    
    async satisListele() {
        this.mainLoader = true
        this.satisListesi = await this.islem.WebServisSorguSonucu("GET", "satisIslemleri/satisListesi", this.filterData)
        if (Object.keys(this.satisListesi).length == 0) { this.satisListesi = null}
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

    satisEkleButton() {
        this.secilenKayit = null
        this.satisEklemeFormu.patchValue({
            islem               :   'satisIslemleri/satisEkle',
            method              :   'POST',
            e_odeme_tipi        :   '',
            e_satis_unique_id   :   '',
        })
        this.detayFilterData.e_satis_unique_id = ''

        this.satisDetayListele()
        this.modalHeader.title = 'Ekleme'
        this.modalAc(this.modalSatis, 'xl')
    }

    satisDetayEkleButton() {
        this.satisDetayEklemeFormu.patchValue({
            islem               :   'satisIslemleri/satisDetayEkle',
            method              :   'POST',
            e_stok_kart_id      :   '',
            e_stok_kart_adi     :   '',
            e_miktar            :   '',
            e_satir_toplami     :   '',
            e_satis_unique_id   :   this.secilenKayit ? this.secilenKayit.e_unique_id : ""
        })
        this.modalHeader.title = 'Ekleme'
        this.modalAc(this.modalSatisDetay, 'lg')
    }

    async satisDuzenleButton(secilenKayit) {
        this.secilenDetay = secilenKayit
        console.log(secilenKayit)
        this.odemeTipi = secilenKayit.e_odeme_tipi
        this.satisEklemeFormu.patchValue({
            islem               :   'satisIslemleri/satisDuzenle',
            method              :   'PUT',
            e_odeme_tipi        :   secilenKayit.e_odeme_tipi,
            e_satis_unique_id   :   secilenKayit.e_unique_id,
            ESKI_ID             :   secilenKayit.e_id,
        })
        this.satisDetayAktarmaFormu.patchValue({
            islem               : 'satisIslemleri/satisDetayAktar',
            method              : 'POST',
            e_satis_unique_id   : secilenKayit.e_unique_id,
            ESKI_ID             : secilenKayit.e_id
        })
        this.detayFilterData.e_satis_unique_id = secilenKayit.e_unique_id
        this.requestData = Object.assign({}, this.satisDetayAktarmaFormu.value)
        this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)
        this.secilenKayit = secilenKayit
        this.modalHeader.title = 'Düzenleme'
        await this.satisDetayListele()
        this.modalAc(this.modalSatis, 'xl')
    }

    satisDetayDuzenleButton(secilenKayit) {
        this.satisDetayEklemeFormu.patchValue({
            islem               :   'satisIslemleri/satisDetayDuzenle',
            method              :   'PUT',
            e_stok_kart_id      :   secilenKayit.e_stok_kart_id,
            e_stok_kart_adi     :   secilenKayit.e_stok_kart_adi,
            e_miktar            :   secilenKayit.e_miktar,
            e_satir_toplami     :   secilenKayit.e_satir_toplami,
            e_satis_unique_id   :   secilenKayit.e_satis_unique_id,
            ESKI_ID             :   secilenKayit.e_id
        })
        this.modalHeader.title = 'Düzenleme'
        this.modalAc(this.modalSatisDetay, 'lg')
    }

    async islemiKaydet(): Promise<void> {
        if (this.satisEklemeFormu.valid) {
          this.islemiKaydetBtn = true
    
          this.requestData = Object.assign({}, this.satisEklemeFormu.value)
          this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

          if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.satisListele()
            this.modalService.dismissAll()
          } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
          }
          
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

    silButton(secilenKayit, islem) {
        Swal.fire({
            title: 'Satış Silinecek!',
            text: "Satışı sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
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
            this.detayKayitSil(secilenDetay, islem)
            }
        })
    }

    async kayitSil(secilenKayit, islem): Promise<void> {
        this.silinenKayitBtn[secilenKayit.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKayit.e_id })
        if ((this.responseData[0].S) == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            const i = this.satisListesi.indexOf(secilenKayit)
            if (i > -1) {
            this.satisListesi.splice(i, 1)
            if (this.satisListesi.length == 0) { this.satisListesi = null }
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

    urunListesiAc() {
        this.modalAc(this.modalUrun, 'xl')
    }

    async urunSec(secilenUrun) {
        this.secilenUrunBtn[secilenUrun.e_id] = true
        this.satisDetayEklemeFormu.patchValue({
            e_stok_kart_adi : secilenUrun.e_stok_kart_adi,
            e_stok_kart_id : secilenUrun.e_id
        })
        document.getElementById("modalUrunKpt").click()
        this.secilenUrunBtn[secilenUrun.e_id] = false
    }

    detayMiktarDuzenle(miktar) {
        let element =  (document.getElementById('miktarInput') as HTMLInputElement)

        if (miktar == '-') {
            this.satisDetayEklemeFormu.controls.e_miktar.setValue(String(Number(element.value) - 1))
        } else {
            this.satisDetayEklemeFormu.controls.e_miktar.setValue(String(Number(element.value) + 1))
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
    
}