import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { satisDetaylariComponent } from './satisDetaylari/satisDetaylari';
import { satisEkleComponent } from './satisEkle/satisEkle';
import { satisIslemleriComponent } from './satisIslemleri/satisIslemleri';
import { siparisIslemleriComponent } from './siparisIslemleri/siparisIslemleri';


const routes: Routes = [{
    path: 'siparisIslemleri',
    component: siparisIslemleriComponent
  }, {
    path: 'satisIslemleri',
    component: satisIslemleriComponent
  }, {
    path: 'satisEkle',
    component: satisEkleComponent
  }, {
    path: 'satisDetaylari/:ID',
    component: satisDetaylariComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class islemlerRoutingModule { }