const getHeadTitle = ({
  name,
  pageName,
  pageDefault,
  label,
}: {
  name: string;
  pageName: string;
  pageDefault: string;
  label?: string,
}) => {
  const title = [
    name || 'Patrimonio Digitale',
    pageName || pageDefault,
  ];
  if (label) {
    title.push(label);
  }
  return title.join(' - ');
};

export { getHeadTitle };
