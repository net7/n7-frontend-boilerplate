import { DataSource } from '@n7-frontend/core';

export class DvGraphDS extends DataSource {
  protected transform() {
    return {
      containerId: 'test-Chart',
      libOptions: {
        chart: {
          height: 550,
          width: 1500,
          type: 'area',
          toolbar: { show: true },
        },
        dataLabels: { enabled: false },
        colors: ['rgba(15,200,255)'],
        fill: {
          colors: ['#0fc8ff'],
          gradient: { opacityFrom: 0.5, opacityTo: 0.1 },
        },
        stroke: { curve: 'straight', width: [2, 1] },
        series: [
          {
            name: 'Reddish value',
            data: [['2019-08-01', '770.17'], ['2019-08-02', '645.03'],
              ['2019-08-03', '709.32'], ['2019-08-04', '708.11'],
              ['2019-08-05', '706.59'], ['2019-08-06', '607.28'],
              ['2019-08-07', '494.59'], ['2019-08-08', '636.81'],
              ['2019-08-09', '709.04'], ['2019-08-10', '717.31'],
              ['2019-08-11', '805.61'], ['2019-08-12', '758.60'],
              ['2019-08-13', '612.82'], ['2019-08-14', '608.90'],
              ['2019-08-15', '734.68'], ['2019-08-16', '838.54'],
              ['2019-08-17', '692.88']],
          },
        ],
        grid: {
          borderColor: '#e7e7e7',
          strokeDashArray: 3,
          xaxis: { lines: { show: true } },
        },
        markers: { size: 3, hover: { size: 6 } },
        xaxis: {
          axisBorder: { show: true, color: '#f4f6fc' },
          labels: {},
          type: 'datetime',
          tickAmount: 6,
        },
        yaxis: [
          {
            show: true,
            showAlways: false,
            opposite: false,
            reversed: false,
            logarithmic: false,
            forceNiceScale: false,
            floating: false,
            labels: {
              show: true,
              minWidth: 0,
              maxWidth: 160,
              offsetX: 0,
              offsetY: 0,
              rotate: 0,
              padding: 20,
              style: { colors: [], fontSize: '11px', cssClass: '' },
            },
            axisBorder: {
              show: true, color: '#f4f6fc', offsetX: 0, offsetY: 0,
            },
            axisTicks: {
              show: false, color: '#78909C', width: 6, offsetX: 0, offsetY: 0,
            },
            title: {
              text: 'P Totale °C', rotate: 90, offsetY: 0, offsetX: 0, style: { fontSize: '11px', cssClass: '' },
            },
            tooltip: { enabled: false, offsetX: 0 },
            crosshairs: { show: true, position: 'front', stroke: { color: '#b6b6b6', width: 1, dashArray: 0 } },
          },
        ],
        legend: { show: true },
        tooltip: {},
        annotations: { yaxis: [], xaxis: [], points: [] },
      },
    };
  }
}
