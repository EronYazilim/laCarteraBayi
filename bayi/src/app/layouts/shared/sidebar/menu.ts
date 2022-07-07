import { MenuItem } from './menu.model'

export const MENU: MenuItem[] = [
	{
		label: 'Anasayfa',
		icon: 'ri-home-4-line',
		link: '/anasayfa'
	}, 
	{
		label: 'Satış İşlemleri',
		icon: 'fas fa-cubes lg-icon',
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
		icon: 'fas fa-cubes lg-icon',
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
		icon: 'ri-user-3-line',
		subItems: [{
			label: 'Kullanıcı Kayıtları',
			link: '/kayitlar/kullaniciKayitlari'
			}
		]
	}
]
	



