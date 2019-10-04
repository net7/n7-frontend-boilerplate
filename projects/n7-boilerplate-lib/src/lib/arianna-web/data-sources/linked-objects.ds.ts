import { DataSource } from '@n7-frontend/core';

export class AwLinkedObjectsDS extends DataSource {

  protected transform(data) {
    switch (this.options.context) {
      case 'overview':
        var amount = 3
        break;
      default:
        var amount = 10
        break;
    }
    return unpackData(data, amount, this.options.configKeys)
  }
}

function unpackData (data, amount, config) {
  if (data.length > amount) {
    data = data.slice(0, amount)
  }
  var result = []
  data.forEach(el => {
    let item = {
      image: el.thumbnail,
      title: el.item.label,
      text: el.item.info[1].value,
      metadata: [
        {
          classes: 'n7-objects__metadata-artist',
          items: [
            { // Artista: Mimmo Jodice
              // label: el.item.info[0].key,
              label: 'Autore',
              value: el.item.info[0].value
            }
          ]
        },
        {
          classes: 'n7-objects__metadata-linked',
          items: el.relatedTOEData.map( toe => {
            const icon = typeof config[toe.type.configKey] != 'undefined' ? config[toe.type.configKey].icon : toe.type.configKey;
            return { // Persone: 6, Organizz: 12, Luoghi: 2, Concetti: 32
              value: toe.count,
              // icon: 'n7-icon-bell' // TODO: link icon to config key
              icon: icon
            }
          })
        }
      ]
    };
    if ( el.breadcrumbs ) {
      item['breadcrumbs'] = { // n7-breadcrumbs uses this as it's own data
      items: el.breadcrumbs.map( crumb => {
          return {
           label: crumb.label,
           payload: crumb.link,
          }
        })
      };
    }

    result.push(item);
  });
  // console.log('final result: ', result)
  return result;
}