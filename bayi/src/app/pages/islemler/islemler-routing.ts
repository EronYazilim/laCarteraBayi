import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { siparisIslemleriComponent } from './siparisIslemleri/siparisIslemleri';


const routes: Routes = [{
    path: 'siparisIslemleri',
    component: siparisIslemleriComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class islemlerRoutingModule { }