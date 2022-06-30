import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { satisIslemleriComponent } from './satisIslemleri/satisIslemleri';
import { siparisIslemleriComponent } from './siparisIslemleri/siparisIslemleri';


const routes: Routes = [{
    path: 'siparisIslemleri',
    component: siparisIslemleriComponent
  }, {
    path: 'satisIslemleri',
    component: satisIslemleriComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class islemlerRoutingModule { }