import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: string, args: any[]): any {
    if(value.length === 11) {
      let val = '8 ';
      val = val.concat('(', value.slice(1, 4), ') ', value.slice(4, 7), '-', value.slice(7, 9), '-', value.slice(9));
      return val;
    } else return value;
  }

}
