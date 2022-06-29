import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { LanguageService } from '../../core/services/language.service'
import { TranslateModule } from '@ngx-translate/core'

import { TopbarComponent } from './topbar/topbar.component'
import { FooterComponent } from './footer/footer.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component'

import { FormDirective } from './shared-directive'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    RouterModule
  ],
  exports: [
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    RightsidebarComponent
  ],
  declarations: [
    TopbarComponent,
    FooterComponent,
    SidebarComponent,
    RightsidebarComponent,
    
    FormDirective
  ],
  providers: [LanguageService]
})

export class SharedModule { }