export default {
  title: 'timeline#title',
  mapHeader: 'timeline#mapheader',
  libOptions: {
    height: '800px',
    locale: 'it_IT',
    cluster: {
      // titleTemplate: 'Clicca per visualizzare {count} eventi',
      maxItems: 3,
    },
    showTooltips: false,
    tooltip: {
      followMouse: false,
      template: (data, element) => `<div class="tooltip">${element.content}</div>`
    },
    template: (itemData, element, data) => {
      if (data.isCluster) {
        return `<div>Clicca per visualizzare ${data.items.length} eventi</div>`; // configurare traduzione
      }
      return `<div>${data.content}</div>`;
    },
    width: '100%',
    minHeight: '350px',
    maxHeight: '800px',
    zoomFriction: 8,
    // limit zoomOut
    zoomMax: '2000000000000',
    start: '1303-01-06T00:00:00',
    end: '1340-01-06T00:00:00'
  }
};
