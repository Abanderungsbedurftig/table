import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IOption } from '../interfaces/option';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  @Input() options: Array<IOption>;
  @Output() onChangeSelector = new EventEmitter<Object>();
  isOpen: boolean = false;
  select: string;

  constructor() { }

  ngOnInit() {
    this.select = this.options[0].name;
  }

  showOptions() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: IOption) {
    this.isOpen = false;
    if(option.name !== this.select) {
      this.select = option.name;
      this.onChangeSelector.emit({ id: option.id, type: option.type });
    }  
  }

}
