import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateAgo' })

export class DateAgoPipe implements PipeTransform {

  transform(value: any, short = false): any {
    if (value) {
      const seconds = Math.floor((+new Date() - (+new Date(value) * 1000)) / 1000);
      const intervals: any = !short ? {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      } : {
        'y': 31536000,
        'm': 2592000,
        'w': 604800,
        'd': 86400,
        'h': 3600,
        'min': 60,
        's': 1
      };

      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          return short ? counter + i : counter + ' ' + i + (counter === 1 ? ' ago' : 's ago');
        }
      }
    }

    return value;
  }
}
