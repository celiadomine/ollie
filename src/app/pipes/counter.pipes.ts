import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'counter',
  standalone: true
})
export class Counter implements PipeTransform {
  transform(totalSeconds: number): string {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return '00:00';
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(seconds).padStart(2, '0');

    return `${minutesString}:${secondsString}`;
  }
}