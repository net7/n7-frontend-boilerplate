import {
  ApexBarChartItem,
  ApexLineChartItem,
  ApexPieChartItem,
  ApexRadarChartItem,
  ApexRadialBarChartItem,
  CardData,
  DataWidgetItem,
  InnerTitleItem,
  SelectItem,
  TableItem,
  TextItem,
  MapItem
} from '@net7/boilerplate-dataviz';

const getTextItem = (label: string): TextItem => {
  getTextItem.counter += 1;
  return {
    id: `text-${getTextItem.counter}`,
    type: 'text',
    initialData: {
      text: `<i>${label}</i>`,
      payload: `text-${getTextItem.counter} click!`
    }
  };
};

getTextItem.counter = 0;

const dataWidgetItem: DataWidgetItem = {
  id: 'item-2',
  type: 'data-widget',
  initialData: {
    icon: 'n7-icon-earth',
    text: '497 <em>Dipendenti</em>',
    subtitle: {
      text: 'In Crescita',
      icon: 'n7-icon-caret-up',
      value: '9%',
      payload: 'view percent tooltip '
    },
    payload: 'view earth tooltip',
    classes: 'is-positive'
  }
};

const pieChartItem: ApexPieChartItem = {
  id: 'item-3',
  type: 'apex-pie-chart',
  initialData: {
    series: [{
      id: 'serie-1',
      name: 'Serie 1',
      data: [44, 55, 13, 43, 22]
    }],
    categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  },
  options: {
    chart: {
      width: 380,
    }
  }
};

const lineChartItem: ApexLineChartItem = {
  id: 'item-4',
  type: 'apex-line-chart',
  initialData: {
    series: [{
      id: 'serie-desktops',
      name: 'Desktops',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148].map((value) => ({
        value,
        metadata: {
          info: `è questo il valore: ${value}`
        }
      }))
    }],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
  options: {
    chart: {
      height: 350,
      width: 550,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    }
  }
};

const barChartItem: ApexBarChartItem = {
  id: 'item-5',
  type: 'apex-bar-chart',
  initialData: {
    series: [{
      id: 'serie-2021',
      name: '2021',
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }, {
      id: 'serie-2020',
      name: '2020',
      data: [300, 530, 418, 370, 240, 680, 390, 100, 200, 1280]
    }],
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
  },
  options: {
    chart: {
      height: 350,
      width: 550
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
  }
};

const radialBarChartItem: ApexRadialBarChartItem = {
  id: 'item-6',
  type: 'apex-radialbar-chart',
  initialData: {
    series: [{
      id: 'serie-avg',
      name: 'Average',
      data: [76]
    }],
    categories: ['Average Results'],
  },
  options: {
    track: {
      background: '#e7e7e7'
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        },
      }
    }
  }
};

const radarBarChartItem: ApexRadarChartItem = {
  id: 'item-7',
  type: 'apex-radar-chart',
  initialData: {
    series: [{
      id: 'serie-avg',
      name: 'Punteggio',
      data: [67, 40, 35, 54, 49, 60]
    }],
    categories: ['Testo', 'Logica', 'Matematica', 'Fisica', 'Chimica', 'Biologia'],
  },
  options: {
    chart: {
      width: '600',
      animations: {
        enabled: true
      }
    },
    fill: {
      opacity: 0.25,
      colors: ['#616161']
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#616161'],
      dashArray: 0
    },
    yaxis: {
      tickAmount: 4,
      min: 0,
      max: 100,
      show: false,
    },
    markers: {
      size: 5,
      colors: ['#616161'],
      hover: {
        size: 10
      }
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: '#FFoooo',
          fill: {
            colors: ['#C5E9C9', '#FBEFC9', '#FFD8C7', '#F8CAC3']
          }
        }
      }
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'right',
      fontSize: '18px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 300,
      horizontalAlign: 'center',
      customLegendItems: ['QUARTILE 3-|4', 'QUARTILE 2-|3', 'QUARTILE 1-|2', 'QUARTILE1'],
      offsetX: 20,
      offsetY: 100,
      markers: {
        fillColors: ['#C5E9C9', '#FBEFC9', '#FFD8C7', '#F8CAC3'],
        width: 20,
        height: 20,
        strokeWidth: 0,
        strokeColor: '#fff',
        radius: 20,
        offsetX: -5,
        offsetY: 3
      },
      customHTML() {
        return '<span class="custom-marker"><i class="fas fa-chart-pie"></i></span>';
      }
    }
  }
};

const tableItem: TableItem = {
  id: 'item-8',
  type: 'table',
  initialData: {
    head: [{
      cells: ['SEZIONE', 'PUNTEGGIO'].map((label) => ({
        content: label
      }))
    }],
    body: [
      { label: 'Biologia', value: 7.5 },
      { label: 'Testo', value: 6.5 },
      { label: 'Fisica', value: 6 },
      { label: 'Chimica', value: 4.5 },
      { label: 'Logica', value: 4 },
      { label: 'Matematica', value: 3 },
    ].map(({ label, value }) => ({
      cells: [{ content: label }, { content: value }]
    }))
  },
};

const selectItem: SelectItem = {
  id: 'item-9',
  type: 'select',
  initialData: {
    id: 'select-punteggio',
    label: 'Punteggio',
    options: [
      'TOTALE',
      'BIOLOGIA',
      'CHIMICA',
      'FISICA',
      'INGLESE',
      'LOGICA',
      'MATEMATICA'
    ].map((label) => ({ label, value: label })),
    payload: 'punteggio'
  },
};

const buttonToggleItem: InnerTitleItem = {
  id: 'item-10',
  type: 'inner-title',
  initialData: {
    title: {
      main: {
        text: ''
      }
    },
    tools: 'Punteggi Normalizzati',
    actions: {
      buttons: [{
        text: 'SI',
        anchor: {
          payload: 'button-yes'
        }
      },
      {
        text: 'NO',
        anchor: {
          payload: 'button-no'
        }
      }]
    }
  },
};

const mapItem: MapItem = {
  id: 'item-11',
  type: 'map',
  initialData: {
    initialView: {
      center: [51.505, -0.09],
      zoom: 13
    },
    markers: [
      {
        coords: [51.505, -0.09],
        template: 'This is the center of the map',
        title: 'London'
      }, {
        coords: [51.495, -0.1],
        template: 'Elephant and castle',
      }, {
        coords: [51.46687084654015, -0.2130156755447388],
        template: 'Putney bridge',
      }
    ]
  },
};

const config: {
  cards: CardData[];
} = {
  cards: [{
    header: {
      sections: [{
        items: [getTextItem('Card 1')]
      }]
    },
    content: {
      sections: [
        {
          items: [getTextItem('Data Widget'), dataWidgetItem]
        },
        {
          items: [getTextItem('Line Chart'), lineChartItem]
        },
        {
          items: [getTextItem('Pie Chart'), pieChartItem]
        },
        {
          items: [getTextItem('Bar Chart'), barChartItem]
        },
        {
          items: [getTextItem('Radial Chart'), radialBarChartItem]
        },
        {
          items: [getTextItem('Radar Chart'), radarBarChartItem]
        },
        {
          items: [getTextItem('Select'), selectItem]
        },
        {
          items: [getTextItem('Inner title'), buttonToggleItem]
        },
        {
          items: [getTextItem('Table'), tableItem]
        },
        {
          items: [getTextItem('Map'), mapItem]
        },
      ]
    }
  }]
};

export default config;
