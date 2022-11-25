import { sampleSize } from 'lodash';

const randomText = () => {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
  return sampleSize(words, Math.round(Math.random() * words.length)).join(' ');
};

const mock = (params) => {
  const { limit } = params;
  const items = Array(limit).fill(null).map((_, i) => ({
    img: 'https://picsum.photos/200',
    label: `[item-${i}] ${randomText()}`,
    id: `item-${i}`,
    breadcrumbs: Array(5).fill(null).map((_b, bi) => ({
      label: randomText(),
      link: `bredcrumb-${bi}`
    }))
  }));

  return {
    totalCount: 1000,
    items
  };
};

export default mock;
