import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { GlobalStats } from '../interfaces/global-stats.interfaces';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'global-stats',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'global-stats.component.html'
})

export class GlobalStatsComponent {
  @Input() globalStats: GlobalStats[];

  constructor(private currencyPipe: CurrencyPipe) {
  }

  getDollarValue(value: number) {
    return this.currencyPipe.transform(value, 'USD', true);
  }
}