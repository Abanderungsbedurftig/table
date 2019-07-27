import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[selectorWidth]'
})
export class SelectorWidthDirective implements OnInit{
  @Input() selectorWidth;
  @HostBinding('style.width') width: string;

  ngOnInit() {
    this.width = this.selectorWidth ? this.selectorWidth + 'px' : '142px'
  }

}
