import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { kullaniciKayitlariComponent } from './kullaniciKayitlari/kullaniciKayitlari';



const routes: Routes = [{
    path: 'kullaniciKayitlari',
    component: kullaniciKayitlariComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class kayitlarRoutingModule { }