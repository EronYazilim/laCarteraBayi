import { MenuItem } from './menu.model'

export const MENU: MenuItem[] = [
	{
		label: 'Anasayfa',
		icon: 'ri-home-4-line',
		link: '/anasayfa'
	}, 
	{
		label: 'Satışlar',
		icon: 'fas fa-solid fa-check',
		subItems: [{
			label: 'Satış Ekleme',
			link: './islemler/satisEkle'
		},{
			label: 'Satış Geçmişi',
			link: '/islemler/satisIslemleri'
		}]
	},
	{
		label: 'Siparişler',
		icon: 'fas fa-solid fa-list',
		subItems: [{
			label: 'Sipariş Oluştur',
			link: '/islemler/siparisEkle'
		},{
			label: 'Sipariş Geçmişi',
			link: '/islemler/siparisIslemleri'
		}]
	},
	{
		label: 'Ayarlar',
		icon: 'ri-settings-3-fill',
		subItems: [{
			label: 'Kullanıcı Kayıtları',
			link: '/kayitlar/kullaniciKayitlari'
			}
		]
	}
]
	



