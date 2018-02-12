import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPipe',
})
export class CustomPipePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return `CustomPipe: ${value}`;
  }
}
