import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { anasayfaComponent } from './anasayfa/anasayfa'

const routes: Routes = [{
  path: '',
  component: anasayfaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class anasayfaRoutingModule { }