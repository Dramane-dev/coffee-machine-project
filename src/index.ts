export const DRINK_TYPE = {
  tea: 'tea',
  chocolate: 'chocolate',
  coffee: 'coffee',
  orange: 'orange juice',
} as const;

export const MESSAGE = 'message';

export const DRINK_TYPE_PROTOCOL_MAPPER = {
  [DRINK_TYPE.tea]: 'T',
  [DRINK_TYPE.chocolate]: 'H',
  [DRINK_TYPE.coffee]: 'C',
  [DRINK_TYPE.orange]: 'O',
  [MESSAGE]: 'M',
} as const;

export type DrinkType = (typeof DRINK_TYPE)[keyof typeof DRINK_TYPE];

export const DRINK_AMOUNT_MAPPER = {
  [DRINK_TYPE.tea]: 40,
  [DRINK_TYPE.chocolate]: 50,
  [DRINK_TYPE.coffee]: 60,
  [DRINK_TYPE.orange]: 60,
} as const;

export type DrinkAmount = (typeof DRINK_AMOUNT_MAPPER)[keyof typeof DRINK_AMOUNT_MAPPER];

export type SugarCount = 0 | 1 | 2;

export type CustomerOrder = {
  drinkType: DrinkType;
  sugar: SugarCount;
  isExtraHot: boolean;
};

export class CustomerOrderToDrinkMakerTranslator {
  private constructor() {}

  static handleCustomerOrder({
    order,
    insertedAmount,
  }: {
    order: CustomerOrder;
    insertedAmount: number;
  }) {
    const selectedDrinkAmount = this.getDrinkAmountInCents(order.drinkType);
    const isInsertedAmountValid = this.validateInsertedAmount({
      drinkAmount: selectedDrinkAmount,
      insertedAmount,
    });

    if (!isInsertedAmountValid) {
      const missingAmount = this.computeMissingAmount({ selectedDrinkAmount, insertedAmount });
      const message = `Missing amount: ${missingAmount} cents`;

      return [DRINK_TYPE_PROTOCOL_MAPPER[MESSAGE], message].join(':');
    }

    return this.translate(order);
  }

  static getDrinkAmountInCents(drinkType: DrinkType) {
    return DRINK_AMOUNT_MAPPER[drinkType];
  }

  static validateInsertedAmount({
    drinkAmount,
    insertedAmount,
  }: {
    drinkAmount: DrinkAmount;
    insertedAmount: number;
  }): boolean {
    return insertedAmount >= drinkAmount;
  }

  static translate(order: CustomerOrder): string {
    const drinkTypeSegment = DRINK_TYPE_PROTOCOL_MAPPER[order.drinkType];
    const extraHotSegmet = order.isExtraHot ? 'h' : '';
    const shouldAddStick = order.sugar > 0;
    const sugarSegment = shouldAddStick ? order.sugar.toString() : '';
    const stickSegment = shouldAddStick ? '0' : '';

    return [`${drinkTypeSegment}${extraHotSegmet}`, sugarSegment, stickSegment].join(':');
  }

  static computeMissingAmount({
    selectedDrinkAmount,
    insertedAmount,
  }: {
    selectedDrinkAmount: number;
    insertedAmount: number;
  }): number {
    return Math.max(0, selectedDrinkAmount - insertedAmount);
  }
}
