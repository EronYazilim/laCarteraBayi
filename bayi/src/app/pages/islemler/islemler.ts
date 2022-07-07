import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxEchartsModule } from "ngx-echarts";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMaskModule } from "ngx-mask";
import { islemlerRoutingModule } from "./islemler-routing";

import { siparisIslemleriComponent } from "./siparisIslemleri/siparisIslemleri";
import { satisIslemleriComponent } from "./satisIslemleri/satisIslemleri";
import { satisEkleComponent } from "./satisEkle/satisEkle";

import { FormDirective } from "./islemler-directive";
import { siparisEkleComponent } from "./siparisEkle/siparisEkle";




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        islemlerRoutingModule,
        NgxEchartsModule,
        NgxMaskModule.forRoot(),
        PaginationModule.forRoot(),
        AccordionModule.forRoot()
    ],
    declarations: [
        siparisIslemleriComponent,
        satisIslemleriComponent,
        satisEkleComponent,
        siparisEkleComponent,

        FormDirective
    ]
})


export class islemlerModule {}