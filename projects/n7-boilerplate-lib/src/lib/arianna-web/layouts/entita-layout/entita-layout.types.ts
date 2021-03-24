export interface EntitaLayoutResponse {
  extraTab: missingType;
  overviewTab: missingType;
  wikiTab: missingType;
  fields: missingType;
  id: string;
  typeOfEntity: string;
  label: string;
  relatedEntities: emptyOrAnyList;
  relatedItems: emptyOrAnyList;
  relatedLa: emptyOrAnyList;
  relatedItemsTotalCount: number;
  relatedLaTotalCount: number;
}

type missingType = null;
type emptyOrAnyList = any[] | [];
