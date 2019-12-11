import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwEntitaMetadataViewerDS extends DataSource {
  protected transform(data) {
    /*
      Access and use this.options if the rendering
      changes based on context.
    */

    let { labels } = this.options;
    labels = labels || {};

    const unpackedData = AwEntitaMetadataViewerDS.unpackFields(data);
    // prettify labels
    unpackedData.forEach(section => {
      section.items
        .filter(item => item.label)
        .forEach(item => item.label = helpers.prettifySnakeCase(item.label, labels[item.label]));
    });
    return {
      group: unpackedData
    };
  }

  // tslint:disable-next-line: member-ordering
  static unpackFields(fields) {
    /*
      Recursive unpacking for rendering res.fields
      - - -
      This function transforms the response object tree
      into an array, usable by metadata-viewer-component
    */
    let extracted = []; // holds transformed object
    // if the server returns an array of key-value tuples
    if (fields instanceof Array) {
      extracted = fields.map(el => {
        return { label: el.key, value: el.value };
      });
      return [{ items: extracted }];
    }
    if (!fields) { return []; } // if is empty → quit
    for (let i = 0; i < fields.length; i++) {
      const thisField = fields[i]; // rename current field
      const title = thisField.label; // field title
      const label = thisField.key; // item label
      const value = thisField.value; // item value
      const group = thisField.fields; // child group
      const temp: any = {}; // temporary object

      if (title) {
        // if there is a title, use it
        temp.title = title;
      }
      if (label && value) {
        // if there are a lable and value, use them
        temp.label = label;
        temp.value = value;
      }
      if (group) {
        // if there is a child group
        if (group[0].key) {
          // if this group has a tuple of (label, value)
          temp.items = AwEntitaMetadataViewerDS.unpackFields(group); // make items array
        } else {
          temp.group = AwEntitaMetadataViewerDS.unpackFields(group); // make child group array
        }
      }
      extracted.push(temp); // add this object to the new array
    }
    return extracted;
  }
}
