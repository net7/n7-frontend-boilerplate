import { ConfigAriannaKeys } from '../config-types';

const getNodeIcon = (
  configKeys: ConfigAriannaKeys,
  item: {
    document_type: string;
    document_classification: string;
  }
) => {
  const { document_type: type, document_classification: classification } = item;
  let icon = configKeys[type] ? configKeys[type].icon : null;
  const lastSegment = /.*\.(\w+)$/;
  if (classification && lastSegment.test(classification)) {
    const classID = classification
      .match(lastSegment)[1] // get classification characters
      .toUpperCase(); // normalize
    icon = configKeys[type].classifications[classID].icon;
  }
  return icon;
};

export default { getNodeIcon };
