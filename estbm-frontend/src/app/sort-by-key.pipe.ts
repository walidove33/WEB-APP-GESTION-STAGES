import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sortByKey'})
export class SortByKeyPipe implements PipeTransform {
  transform(obj: any): { key: number; value: any }[] {
    return Object.entries(obj)
      .map(([k,v]) => ({ key: +k, value: v }))
      .sort((a,b) => a.key - b.key);
  }
}
