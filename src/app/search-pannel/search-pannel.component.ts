import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { IOption } from '../interfaces/option';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-pannel',
  templateUrl: './search-pannel.component.html',
  styleUrls: ['./search-pannel.component.css']
})
export class SearchPannelComponent implements OnInit, OnChanges {
  @Input() selectorOptions;
  @Output() onChangeSelector = new EventEmitter<any>();
  type: Array<Object>;
  objStatus: Array<IOption>;
  managers: Array<IOption>;
  company: Array<IOption>;
  query: Object = {};
  searchControl: FormControl;

  constructor() {
    this.type = [{id: null, name: 'Тип сделки', type: 'deal_type'}, 
                 {id: 'rent', name: 'Аренда', type: 'deal_type'}, 
                 {id: 'sale', name: 'Продажа', type: 'deal_type'}, 
                 {id: 'business_sale', name: 'Business sale', type: 'deal_type'}];
    this.objStatus = [{id: null, name: 'Статус объекта', type: 'status'}];
    this.managers = [{id: null, name: 'Все менеджеры', type: 'client_manager'}];
    this.company = [{id: null, name: 'Компания', type: 'company'}];
    this.searchControl = new FormControl('', [Validators.pattern('[а-яА-Яa-zA-Z0-9]*'), Validators.maxLength(20)]);
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => {
        if(this.searchControl.status === 'VALID') this.addQueryParameter({type: 'search', id: value});  
      });
  }

  ngOnChanges() {
    if(this.selectorOptions) {
      this.selectorOptions.company.forEach(comp => this.company.push({id: comp.id, name: comp.title, type: 'company'}));
      this.selectorOptions.managers.forEach(man => this.managers.push({id: man.id, name: man.username, type: 'client_manager'}));
      this.selectorOptions.statuses.forEach(status => this.objStatus.push({id: status.id, name: status.title, type: 'status'}));
    }
  }

  addQueryParameter(selector: any) {
    this.query[selector.type] = selector.id;
    let queryObject = {};
    Object.keys(this.query).forEach(key => {
      if (this.query[key] !== null) queryObject[key] = this.query[key];
    });
    this.onChangeSelector.emit(queryObject);
  }

}
