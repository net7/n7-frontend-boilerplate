import { DataSource } from '@n7-frontend/core';
import { HERO_MOCK } from '@n7-frontend/components';

export class AwHeroDS extends DataSource {

  protected transform(data){
    console.log({data});
    const HERO_DATA = {
      title: "Arte, architettura e fotografia nel XXII secolo",
      text: "Consulta il patrimonio completo del polo nazionale per l\'arte e l\'architettura contemporanee.",
      button: {
        text: "CERCA",
        payload: "cerca"
      },
      backgroundImage: "https://i.imgur.com/FgsxSYR.png",
      input: {
        placeholder: "Cerca in MAXXI",
        payload: "cerca-in-maxxi"
      }
    };  
    return HERO_DATA;
  }
}