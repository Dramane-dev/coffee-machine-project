export const DRINK_TYPE = {
  tea: 'tea',
  chocolate: 'chocolate',
  coffee: 'coffee',
} as const;

export const DRINK_TYPE_PROTOCOL_MAPPER = {
  [DRINK_TYPE.tea]: 'T',
  [DRINK_TYPE.chocolate]: 'H',
  [DRINK_TYPE.coffee]: 'C',
} as const;

export type DrinkType = (typeof DRINK_TYPE)[keyof typeof DRINK_TYPE];

export type SugarCount = 0 | 1 | 2;

export type CustomerOrder = {
  drinkType: DrinkType;
  sugar: SugarCount;
};

export class CustomerOrderToDrinkMakerTranslator {
  private constructor() {}

  static translate(order: CustomerOrder): string {
    const drinkTypeSegment = DRINK_TYPE_PROTOCOL_MAPPER[order.drinkType];
    const shouldAddStick = order.sugar > 0;
    const sugarSegment = shouldAddStick ? order.sugar.toString() : '';
    const stickSegment = shouldAddStick ? '0' : '';

    return [drinkTypeSegment, sugarSegment, stickSegment].join(':');
  }
}
