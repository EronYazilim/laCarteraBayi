import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { girisComponent } from './giris/giris';

const routes: Routes = [{
  path: 'giris', 
  component: girisComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class oturumRoutingModule { }