import { Pipe, PipeTransform } from '@angular/core';
import { colors, szinek } from './models/color.model';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  transform(value: string)  {
    return szinek[colors.indexOf(value)]
  }
}
