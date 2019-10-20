import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js';
import * as moment from 'moment';
import { ChartService } from './chart.service';
import { CoinInterface } from '../interfaces/coin.interface';

// default variables
const DEFAULT_IDS: string = '7,10'; // example 2,4,10
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
    const timeStamp = this.generateTimeStamp(coins[0].history.length);
    const data = this.generateData(coins);
    const options = this.getOptions();

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
      const gradientItem = this.makeGradient(item.color);
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
  /**
   * Generate days from today
   * @param count number
   * @returns []
   */
  private generateTimeStamp(count): string[] {
    const result = [];
    for (let i = count; i >= 0; i -= 1) {
      result.push(moment().subtract(i, 'd').format('MMM DD'));
    }
    return result;
  }
  /**
   * Convert HEX to RGBA color
   * @param hex
   */
  private hexToRgbA(hex): string {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [ (c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
  }
  /**
   * Make custom gradient for graph
   * @param colorHex
   */
  private makeGradient(colorHex): CanvasGradient {

    const color = this.hexToRgbA(colorHex);
    const changedColor = color.split(',');
    const gradient = this.chartRef.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 650);

    for (let i = 1; i >= 0; i -= 0.5) {
      changedColor.splice(changedColor.length - 1, 1).push(`${i})`);
      changedColor.push(`${1 - i})`);
      gradient.addColorStop(i, changedColor.join(','));
    }

    return gradient;
  }
  /**
   * Chart options
   */
  getOptions() {
    return {
      scales: {
        yAxes: [{
          gridLines : {
            display : false
            },
            scaleLabel: {
                  display: true,
                  labelString: 'Currency $',
                  fontSize: 20
              }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontSize: 20
        }
        }]
    },
    tooltips: {
      custom: (element) => {
        let color;
        if (element.dataPoints) {
          color = this.tooltipColors[element.dataPoints[0].datasetIndex];
        }
        element.y -= 15;
        element.backgroundColor = color;
      },
      callbacks: {
        label: (item) => item.value,
        title: () => ''
      },
      yAlign: 'bottom',
      xAlign: 'center',
      xPadding: 5,
      yPadding: 15,
      displayColors: false,
      titleFontSize: 21
    },
    hover: {
      mode: 'nearest',
      onHover: function(e) {
         const point = this.getElementAtEvent(e);
         if (point.length) {
           e.target.style.cursor = 'pointer';
        } else {
          e.target.style.cursor = 'default';
        }
      }
   }
    };
  }
}
