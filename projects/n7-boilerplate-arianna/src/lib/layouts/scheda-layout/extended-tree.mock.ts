import { sampleSize } from 'lodash';

const randomText = () => {
  const words = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');
  return sampleSize(words, Math.round(Math.random() * words.length)).join(' ');
};

const mock = (params) => {
  const { page } = params;
  const items = Array(10).fill(null).map((_, i) => ({
    thumbnail: 'https://picsum.photos/200',
    label: `[${page}-${i}] ${randomText()}`,
    id: `${page}-${i}`,
  }));

  return {
    totalCount: 1000,
    results: { items }
  };
};

export default mock;
