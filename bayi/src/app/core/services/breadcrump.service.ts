import {Injectable, Output, EventEmitter} from '@angular/core'

@Injectable()

export class BreadcrumpService {
  @Output() breadcrump: EventEmitter<any> = new EventEmitter()
  @Output() anaBaslik: EventEmitter<any> = new EventEmitter()

   constructor() {
   }

  change(newBreadcrump) {
    if (newBreadcrump.length == 0) {
      this.breadcrump.emit(null)
      this.anaBaslik.emit('Anasayfa')
    } else {
      this.breadcrump.emit(newBreadcrump)
      this.anaBaslik.emit(newBreadcrump[newBreadcrump.length-1])
    }
  }

  getBreadcrumpValue() {
    return this.breadcrump
  }

  getBaslikValue() {
    return this.anaBaslik
  }
} 