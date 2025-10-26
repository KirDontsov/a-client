// promotionMapper.ts
interface PromotionInfo {
  value: string;
  description: string;
}

export const promotionMapper: PromotionInfo[] = [
  {
    value: 'Highlight',
    description: '«Выделение цветом» (действует 7 дней)',
  },
  {
    value: 'XL',
    description: '«XL-объявление» (действует 7 дней)',
  },
  {
    value: 'x2_1',
    description: '«До 2 раз больше просмотров на 1 день»',
  },
  {
    value: 'x2_7',
    description: '«До 2 раз больше просмотров на 7 дней»',
  },
  {
    value: 'x5_1',
    description: '«До 5 раз больше просмотров на 1 день»',
  },
  {
    value: 'x5_7',
    description: '«До 5 раз больше просмотров на 7 дней»',
  },
  {
    value: 'x10_1',
    description: '«До 10 раз больше просмотров на 1 день»',
  },
  {
    value: 'x10_7',
    description: '«До 10 раз больше просмотров на 7 дней».',
  },
  {
    value: 'x15_1',
    description: '«До 15 раз больше просмотров на 1 день». Доступно в некоторых регионах и категориях.',
  },
  {
    value: 'x15_7',
    description: '«До 15 раз больше просмотров на 7 дней». Доступно в некоторых регионах и категориях.',
  },
  {
    value: 'x20_1',
    description: '«До 20 раз больше просмотров на 1 день». Доступно в некоторых регионах и категориях.',
  },
  {
    value: 'x20_7',
    description: '«До 20 раз больше просмотров на 7 дней». Доступно в некоторых регионах и категориях.',
  },
];

export const getPromotionInfo = (value: string): PromotionInfo | undefined => {
  return promotionMapper.find((item) => item.value === value);
};

// Remove the getPromotionIcon function as we'll be using SVG components directly in the component
export const getPromotionTooltip = (value: string): string => {
  const promotion = getPromotionInfo(value);
  return promotion ? promotion.description : value;
};
