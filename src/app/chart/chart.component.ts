import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js';
import { ChartService } from './chart.service';
import { CoinInterface } from '../interfaces/coin.interface';
import { makeGradient, generateTimeStamp, getOptions } from './helpers/functions';

// default variables
const DEFAULT_IDS: string = '7,10'; // example 2,4,10 || 2,4,24
const DEFAULT_PERIOD: string = '30d';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild('chartView', {static: true}) private chartRef: ElementRef;
  private chart: any;
  private coins: CoinInterface[];
  private tooltipColors: string[] = [];

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.chartService.getCoins(DEFAULT_IDS, DEFAULT_PERIOD).subscribe((res) => {
      this.coins = res;
      this.buildGraph(this.coins);
    });
  }
  /**
   * Build graph
   * @param coins
   */
  private buildGraph(coins): void {
    const timeStamp = generateTimeStamp(coins[0].history.length);
    const data = this.generateData(coins);
    const options = getOptions(this.tooltipColors);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: timeStamp,
        datasets: data
      },
      options
      });
  }
  /**
   * Generate data
   * @param coins
   */
  generateData(coins): [] {
    return coins.map((item) => {
      const gradientItem = makeGradient(item.color, this.chartRef);
      // OLD REALIZATION, On my mind it's not perfect, I did my custom realization
      // const gradientItem = () => {
      //   const gradient = this.chartRef.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 650);
      //   gradient.addColorStop(0, item.color);
      //   gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
      //   return gradient;
      // };
      this.tooltipColors.push(item.color);
      return {
        label: item.name,
        fill: true,
        backgroundColor: gradientItem,
        borderColor: item.color,
        pointBorderColor: item.color,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: item.color,
        pointHoverBorderColor: item.color,
        pointHoverBorderWidth: 2,
        pointRadius: 6,
        pointHitRadius: 10,
        data: item.history
      };
    });
  }
}
