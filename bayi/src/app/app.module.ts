import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { LayoutsModule } from './layouts/layouts.module'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { BreadcrumpService } from './core/services/breadcrump.service'
import { ToastrModule  } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot()
  ],
  providers: [
    BreadcrumpService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }