import { Directive, HostListener, ElementRef } from '@angular/core'
import { ToastrService } from 'ngx-toastr'

@Directive({
  selector: '[validControl]'
})

export class FormDirective {
  constructor(
    private el: ElementRef,
    private toastr: ToastrService
  ) { }

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid')
    const controls = [invalidControl][0]

    if (invalidControl) {
      invalidControl.focus()
      if (controls.validity) {
        if (controls.validity.patternMismatch) {
          this.toastr.error('', '"' + invalidControl.title + '" alanı için girilen değer uygun değil!', { timeOut: 3000, closeButton: true, progressBar: true })
        } else if (controls.validity.tooLong) {
          this.toastr.error('', '"' + invalidControl.title + '" alanı en fazla ' + controls.maxLength + ' karakter olmalı!', { timeOut: 3000, closeButton: true, progressBar: true })
        } else if (controls.validity.tooShort) {
          this.toastr.error('', '"' + invalidControl.title + '" alanı en az ' + controls.minLength + ' karakter olmalı!', { timeOut: 3000, closeButton: true, progressBar: true })
        } else if (controls.validity.rangeUnderflow) {
          this.toastr.error('', '"' + invalidControl.title + '" alanı için girilen değer en az ' + controls.min + ' olabilir!', { timeOut: 3000, closeButton: true, progressBar: true })
        } else if (controls.validity.rangeOverflow) {
          this.toastr.error('', '"' + invalidControl.title + '" alanı için girilen değer en fazla ' + controls.max + ' olabilir!', { timeOut: 3000, closeButton: true, progressBar: true })
        } else {
          this.toastr.error('', '"' + invalidControl.title + '" alanı boş bırakılamaz!', { timeOut: 3000, closeButton: true, progressBar: true })
        }
      } else {
        this.toastr.error('', '"' + invalidControl.title + '" alanı boş bırakılamaz!', { timeOut: 3000, closeButton: true, progressBar: true })
      }

      for (var i = 0; i < this.el.nativeElement.getElementsByClassName('ng-invalid').length; ++i) {
        this.el.nativeElement.getElementsByClassName('ng-invalid')[i].classList.add('ng-touched')
      }
    }
  }
}