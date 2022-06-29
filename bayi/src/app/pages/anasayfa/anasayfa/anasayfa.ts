import { Component, OnInit } from '@angular/core'
import { webServisIslemCalistir } from '../../../ISLEM'
import { BreadcrumpService } from '../../../core/services/breadcrump.service'
import { Title } from '@angular/platform-browser'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-anasayfa',
  templateUrl: './anasayfa.html'
})

export class anasayfaComponent implements OnInit {
  constructor(
    public islem : webServisIslemCalistir,
    private toastr: ToastrService,
    private bs: BreadcrumpService,
    private titleService: Title
  ) { }

  async ngOnInit() {
    this.titleService.setTitle("laCartera | Anasayfa")
    this.bs.change([])


  }

}