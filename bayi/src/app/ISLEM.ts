import { Injectable } from "@angular/core"
import { LocalStoreService } from './core/services/local-store.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthenticationService } from "./core/services/auth.service"
import { ToastrService } from 'ngx-toastr'

@Injectable({
	providedIn: "root"
})

export class webServisIslemCalistir {
	constructor(
		private hC: HttpClient,
		private store: LocalStoreService,
		private auth: AuthenticationService,
		private toastr: ToastrService,
	) { }

	WebServisSorguSonucu(METHOD, ISLEM_URL, BODY): Promise < object > {
		return new Promise < object > (resolve => {
			
			if (location.origin == "http://localhost:5772") {
				var URL = "https://test.eronsoftware.com:5770/bayi/"
			} else {
				var URL = "https://eronsoftware.com:5770/bayi/"
			}

			var UTOKEN = ""

			try { UTOKEN = this.store.getItem("laCartera_bayi_kullanici_token") } catch (e) { UTOKEN = "" }

			var httpOptions = {
				headers: new HttpHeaders({
					"Content-Type": "text/plain",
					"Accept": "*/*",
					"utoken": "" + UTOKEN + "",
				})
			}

			var replaceBODY = ""
			var resolveBODY

			replaceBODY = JSON.stringify(BODY).replace(/'/g, "__T__") // --> veritabanı karakter çakuışmasını gidermek için tırnak replace edildi              
			BODY = JSON.parse(replaceBODY)

			if (METHOD == "GET"){
				this.hC.get((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
							if (Object.keys(data).length != 0) {
								if (data[0].S) {
									if (
										(data[0].S == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data[0].HATA_KODU == "799") ||
											(data[0].HATA_KODU == "991") ||
											(data[0].HATA_KODU == "993") ||
											(data[0].HATA_KODU == "994") ||
											(data[0].HATA_KODU == "2001") ||
											(data[0].HATA_KODU == "2002")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data[0].S == "H") && (data[0].HATA_KODU == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "POST") {
				this.hC.post((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
							if (Object.keys(data).length != 0) {
								if (data[0].S) {
									if (
										(data[0].S == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data[0].HATA_KODU == "799") ||
											(data[0].HATA_KODU == "991") ||
											(data[0].HATA_KODU == "993") ||
											(data[0].HATA_KODU == "994") ||
											(data[0].HATA_KODU == "2001") ||
											(data[0].HATA_KODU == "2002")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data[0].S == "H") && (data[0].HATA_KODU == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "PUT") {
				this.hC.put((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
							if (Object.keys(data).length != 0) {
								if (data[0].S) {
									if (
										(data[0].S == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data[0].HATA_KODU == "799") ||
											(data[0].HATA_KODU == "991") ||
											(data[0].HATA_KODU == "993") ||
											(data[0].HATA_KODU == "994") ||
											(data[0].HATA_KODU == "2001") ||
											(data[0].HATA_KODU == "2002")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data[0].S == "H") && (data[0].HATA_KODU == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "DELETE") {
				this.hC.delete((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
							if (Object.keys(data).length != 0) {
								if (data[0].S) {
									if (
										(data[0].S == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data[0].HATA_KODU == "799") ||
											(data[0].HATA_KODU == "991") ||
											(data[0].HATA_KODU == "993") ||
											(data[0].HATA_KODU == "994") ||
											(data[0].HATA_KODU == "2001") ||
											(data[0].HATA_KODU == "2002")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data[0].S == "H") && (data[0].HATA_KODU == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			}
		})
	}

	replace(input, from, to) {
		if(input === undefined) {
			return
		}
		var regex = new RegExp(from, 'g')
		return input.replace(regex, to)
	}
}