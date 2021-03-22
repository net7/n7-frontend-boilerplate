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
  totalCount: number;
}

type missingType = null;
type emptyOrAnyList = any[] | [];
