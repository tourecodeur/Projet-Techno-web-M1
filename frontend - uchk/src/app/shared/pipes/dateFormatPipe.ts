import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const date = new Date(value);
    const jour = date.getDate();
    const mois = date.getMonth() + 1;
    const annee = date.getFullYear();
    const heures = date.getHours();
    const minutes = date.getMinutes();
    const secondes = date.getSeconds();

    return `${jour}-${mois}-${annee} ${heures}:${minutes}:${secondes}`;
  }

}