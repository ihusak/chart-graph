import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import * as moment from 'moment';
import { ChartService } from './chart.service';
import { CoinInterface } from '../interfaces/coin.interface';

const DEFAULT_IDS: string = '2,4';
const DEFAULT_PERIOD: string = '30d';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild('chartView', {static: true}) private chartRef;
  private chart: any;
  private coins: CoinInterface[];

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
    const timeStamp = this.generateTimeStamp(coins[0].history.length);
    const data = this.generateData(coins);
    const options = this.getOptions();
    const chartCtx = this.chartRef.nativeElement.getContext('2d');

    this.chart = new Chart(chartCtx, {
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
      const gradientItem = () => {
        const gradient = this.chartRef.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 650);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0, item.color);
        return gradient;
      };
      return {
        label: item.name,
        fill: true,
        lineTension: 0,
        backgroundColor: gradientItem(),
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: item.color,
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
        pointRadius: 6,
        pointHitRadius: 10,
        showLine: true,
        data: item.history
      }
    })
  }
  getOptions() {
    return {
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            scaleLabel: {
                  display: true,
                  labelString: 'Currency $',
                  fontSize: 20
              }
        }]
    }
    };
  }
  /**
   * Generate days from today
   * @param count number
   * @returns []
   */
  private generateTimeStamp(count): string[] {
    const result = [];
    for (let i = count; i >= 0; i -= 1) {
      result.push(moment().subtract(i, 'd').format('DD MMM'));
    }
    return result;
  }
}
