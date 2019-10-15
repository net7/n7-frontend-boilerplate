import { DataSource } from '@n7-frontend/core';

export class AwEntitaMetadataViewerDS extends DataSource {

  protected transform(data){
    /*
      // console.log('metadata options: ', this.options);
      - - -
      Access and use this.options if the rendering 
      changes based on context.
    */
   
    return {
      group: AwEntitaMetadataViewerDS.unpackFields(data),
    }
  }

  static unpackFields( fields ) {
    /*
      Recursive unpacking for rendering res.fields
      - - -
      This function transforms the response object tree
      into an array, usable by metadata-viewer-component
    */
    var extracted = []     // holds transformed object
    if (!fields) return [] // if is empty → quit
    for ( let i = 0; i < fields.length; i++ ) {
      var thisField = fields[i]     // rename current field
      var title = thisField.label   // field title
      var label = thisField.key     // item label
      var value = thisField.value   // item value
      var group = thisField.fields  // child group
      var temp:any = {}             // temporary object

      if (title) { // if there is a title, use it
        temp.title = title
      } if (label && value) { // if there are a lable and value, use them
        temp.label = label
        temp.value = value
      } if (group) { // if there is a child group
        if (group[0].key) { // if this group has a tuple of (label, value)
          temp.items = AwEntitaMetadataViewerDS.unpackFields(group) // make items array
        } else {
          temp.group = AwEntitaMetadataViewerDS.unpackFields(group) // make child group array
        }
      }
      extracted.push(temp) // add this object to the new array
    }
    return extracted
  }

}