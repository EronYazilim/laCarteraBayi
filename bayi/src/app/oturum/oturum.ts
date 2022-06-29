import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { oturumRoutingModule } from './oturum-routing';
import { girisComponent } from './giris/giris';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormDirective } from '../core/directives/form.directive';

@NgModule({
  imports: [
    CommonModule,
    oturumRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    girisComponent,
    
    FormDirective
  ]
})

export class oturumModule { }