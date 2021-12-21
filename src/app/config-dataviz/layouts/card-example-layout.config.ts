import {
  ApexBarChartItem,
  ApexLineChartItem,
  ApexPieChartItem,
  ApexRadarChartItem,
  ApexRadialBarChartItem,
  CardData,
  DataWidgetItem,
  InnerTitleItem,
  TableItem,
  TextItem
} from '@n7-frontend/boilerplate';

const textItem: TextItem = {
  id: 'item-1',
  type: 'text',
  initialData: '<b>Hello</b> <i>world</i>!',
};

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
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  },
  options: {
    chart: {
      height: 350,
      width: 350,
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
    },
  }
};

const barChartItem: ApexBarChartItem = {
  id: 'item-5',
  type: 'apex-bar-chart',
  initialData: {
    series: [{
      id: 'serie-countries',
      name: 'Countries',
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
  },
  options: {
    chart: {
      height: 350,
      width: 350
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

const selectItem: InnerTitleItem = {
  id: 'item-9',
  type: 'inner-title',
  initialData: {
    title: {
      main: {
        text: 'Punteggio'
      }
    },
    actions: {
      select: {
        options: [
          'TOTALE',
          'BIOLOGIA',
          'CHIMICA',
          'FISICA',
          'INGLESE',
          'LOGICA',
          'MATEMATICA'
        ].map((label) => ({ text: label, value: label })),
        payload: 'punteggio'
      },
    }
  },
};

const buttonToggleItem: InnerTitleItem = {
  id: 'item-10',
  type: 'inner-title',
  initialData: {
    title: {
      main: {
        text: 'Punteggi Normalizzati'
      }
    },
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

const config: {
  cards: CardData[];
} = {
  cards: [{
    title: {
      text: 'Card 1',
      classes: 'card-1-title'
    },
    actions: [{
      label: null,
      payload: 'action-1-emit',
      icon: 'n7-icon-earth',
      classes: 'action-1-class'
    }, {
      header: {
        // label: 'Options',
        icon: {
          open: 'n7-icon-caret-up',
          close: 'n7-icon-caret-down'
        }
      },
      items: [1, 2, 3, 4, 5].map((number) => ({
        label: `Item ${number}`,
        payload: `item-${number}-emit`,
        // icon: 'n7-icon-earth',
        classes: `item-${number}-class`
      }))
    }],
    sections: [
      {
        items: [textItem, dataWidgetItem]
      },
      {
        items: [lineChartItem, pieChartItem]
      },
      {
        items: [barChartItem, radialBarChartItem]
      },
      {
        items: [radarBarChartItem, tableItem]
      },
      {
        items: [selectItem]
      },
      {
        items: [buttonToggleItem]
      }
    ]
  }]
};

export default config;
