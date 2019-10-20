import { ElementRef } from '@angular/core';
import * as moment from 'moment';

/**
 * Convert HEX to RGBA color
 * @param hex
 */
const hexToRgba = (hex): string => {
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
};
/**
 * Make custom gradient for graph
 * @param colorHex
 */
const makeGradient = (colorHex: string, ref: ElementRef): CanvasGradient => {

    const color = hexToRgba(colorHex);
    const changedColor = color.split(',');
    const gradient = ref.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 650);

    for (let i = 1; i >= 0; i -= 0.5) {
      changedColor.splice(changedColor.length - 1, 1).push(`${i})`);
      changedColor.push(`${1.2 - i})`);
      gradient.addColorStop(i, changedColor.join(','));
    }

    return gradient;
  };

/**
 * Generate days from today
 * @param count number
 * @returns []
 */
const generateTimeStamp = (count): string[] => {
  const result = [];
  for (let i = count; i >= 0; i -= 1) {
    result.push(moment().subtract(i, 'd').format('MMM DD'));
  }
  return result;
};
/**
 * Chart options
 */
const getOptions = (tooltipColors) => {
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
        color = tooltipColors[element.dataPoints[0].datasetIndex];
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

export {makeGradient, generateTimeStamp, getOptions}