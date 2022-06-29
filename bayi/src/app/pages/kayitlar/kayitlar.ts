import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxEchartsModule } from "ngx-echarts";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMaskModule } from "ngx-mask";
import { kayitlarRoutingModule } from "./kayitlar-routing";

import { kullaniciKayitlariComponent } from "./kullaniciKayitlari/kullaniciKayitlari";

import { FormDirective } from "./kayitlar-directive";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        kayitlarRoutingModule,
        NgxEchartsModule,
        NgxMaskModule.forRoot(),
        PaginationModule.forRoot(),
        AccordionModule.forRoot()
    ],
    declarations: [
        kullaniciKayitlariComponent,
        
        FormDirective
    ]
})


export class kayitlarModule {}