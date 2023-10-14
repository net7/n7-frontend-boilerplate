/* eslint-disable */
export default {
  images: [{
    tileSource: {
      type: 'image',
      url: 'http://muruca.oc.wshare.net/wp-content/uploads/2023/09/hd-wallpaper-g675444de3_1920.jpg',
    },
    width: 1920,
  }, {
    tileSource: {
      type: 'image',
      url: 'https://openseadragon.github.io/example-images/grand-canyon-landscape-overlooking.jpg',
    },
    width: 5000,
  }, {
    tileSource: {
      type: 'image',
      url: 'https://openseadragon.github.io/example-images/grand-canyon-landscape-overlooking.jpg',
    },
    width: 5000,
  }],
  overlay_images: [{
    style: {
      highlight_color: '#0bb384',
      highlight_opacity: 0.7,
      border_color: '#1b5b6d',
      border_opacity: 0.5,
      border_width: 2
    },
    hotspots: [{
      coordinates: '961,383,68',
      shape: 'circle',
      title: 'luce faro',
      action: 'url',
      description: '',
      detail_image_id: '',
      detail_image: false,
      'action-url-url': 'http:\/\/muruca.oc.wshare.net\/wp-json\/muruca-core-v2\/v1\/record\/15',
      'action-url-open-in-window': false
    },
    {
      coordinates: '995,566 995,459 1060,459 1060,566',
      shape: 'rectangle',
      title: 'silos',
      action: '',
      description: 'silos del faro',
      detail_image_id: '',
      detail_image: false,
      'action-url-url': false,
      'action-url-open-in-window': false
    },
    {
      coordinates: '682,666 902,536 1140,500 1246,710 930,834 684,824',
      shape: 'polygon',
      title: 'In dui magna',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean viverra rhoncus pede. Etiam vitae tortor. Ut non enim eleifend felis pretium feugiat. Curabitur at lacus ac velit ornare lobortis.\r\n\r\nCurabitur blandit mollis lacus. Fusce vel dui. Fusce egestas elit eget lorem. Sed lectus. Etiam ut purus mattis mauris sodales aliquam.\r\n\r\nPraesent ac sem eget est egestas volutpat. Duis leo. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Suspendisse potenti.\r\n\r\n&nbsp;',
      detail_image_id: 24,
      detail_image: 'http:\/\/muruca.oc.wshare.net\/wp-content\/uploads\/2023\/09\/ad-space-01-300x250-1.jpg'
    }]
  }, 
  {},
  {
    style: {
      highlight_color: '#AED6F1',
      highlight_opacity: 0.3,
      border_color: '#3498DB',
      border_opacity: 0.5,
      border_width: 2
    },
    hotspots: [{
      coordinates: '0,1625 0,0 1250,0 1250,1625',
      shape: 'polygon',
      title: 'Grand Canyon',
      description: 'Altra immagine!',
      detail_image_id: 24,
      detail_image: 'http:\/\/muruca.oc.wshare.net\/wp-content\/uploads\/2023\/09\/ad-space-01-300x250-1.jpg'
    }]
  }
]
};