import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { satisEkleComponent } from './satisEkle/satisEkle';
import { satisIslemleriComponent } from './satisIslemleri/satisIslemleri';
import { siparisEkleComponent } from './siparisEkle/siparisEkle';
import { siparisIslemleriComponent } from './siparisIslemleri/siparisIslemleri';


const routes: Routes = [{
    path: 'siparisIslemleri',
    component: siparisIslemleriComponent
  }, {
    path: 'siparisEkle',
    component: siparisEkleComponent
  }, {
    path: 'satisIslemleri',
    component: satisIslemleriComponent
  }, {
    path: 'satisEkle',
    component: satisEkleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class islemlerRoutingModule { }