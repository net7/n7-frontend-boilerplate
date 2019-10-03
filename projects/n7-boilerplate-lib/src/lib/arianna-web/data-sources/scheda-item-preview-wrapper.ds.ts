import { DataSource } from '@n7-frontend/core';

export class AwSchedaItemPreviewWrapperDS extends DataSource {

  protected transform(data) {
    let result = [];
    data.forEach(item => {
      let infoGroup = [
        { label: 'Autore', value: '' },
        { label: '', value: '' } ];
      item.item.info.forEach( i => {
        if(i.key==='author') infoGroup[0].value=i.value;
        else if(i.key==='short_description') infoGroup[1].value=i.value;
      });
      let toeGroup = item.relatedTOEData.map( rToe => {
          return {
            label: rToe.type.label,
            value: rToe.count,
            icon: rToe.type.icon
          };
      });
      let metadata = [{items:infoGroup},{items:toeGroup}];
      result.push({
        image: item.thumbnail,
        title: item.item.label,
        metadata,
        payload: item.item.id
      });
    });
    return result;
  }
}