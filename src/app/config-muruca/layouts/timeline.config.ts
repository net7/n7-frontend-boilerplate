export default {
  title: 'timeline#title',
  mapHeader: 'timeline#mapheader',
  libOptions: {
    height: '500px',
    locale: 'it_IT',
    cluster: {
      titleTemplate: 'Clicca per visualizzare {count} eventi',
      maxItems: 1,
    },
    showTooltips: false,
    tooltip: {
      followMouse: false,
      template: (data, element) => `<div class="tooltip">${element.content}</div>`
    },
    template: (itemData, element, data) => {
      if (data.isCluster) {
        return `${data.items.length} eventi raggruppati</div>`;
      }
      return `<div>${data.content}</div>`;
    },
    width: '100%',
    minHeight: '350px',
    maxHeight: '800px',
    zoomFriction: 8,
  }
};
