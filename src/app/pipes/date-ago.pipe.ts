import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'dateAgo' })

export class DateAgoPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(value: any, short = false): any {
    if (value) {
      const seconds = Math.floor((+new Date() - (+new Date(value) * 1000)) / 1000);
      const intervals: any = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };

      let counter, date;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (short) {
            date = this.translate.instant('DATE.SHORT.' + i.toUpperCase());
            if (date.startsWith('DATE')) {
              date = this.translate.instant('DATE.SINGULAR.' + i.toUpperCase())[0];
            } return counter + date;
          } else {
            date = this.translate.instant('DATE.SINGULAR.' + i.toUpperCase());
            if (counter > 1) {
              let plural = this.translate.instant('DATE.PLURAL.' + i.toUpperCase());
              if (plural.startsWith('DATE')) { date += 's'; } else { date = plural; }
            } return this.translate.instant('DATE.AGO', { counter: counter, date: date });
          }
        }
      }
    }

    return value;
  }
}
