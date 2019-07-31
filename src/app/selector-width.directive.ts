import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[selectorWidth]'
})
export class SelectorWidthDirective implements OnInit{
  @Input() selectorWidth;
  @HostBinding('style.width') width: string;

  ngOnInit() {
    let width = window.screen.width;
    if (width > 1299) this.width = this.selectorWidth ? this.selectorWidth + 'px' : '142px';
    else if (width > 481 && width < 1300) this.width = '16%';
  }

}
