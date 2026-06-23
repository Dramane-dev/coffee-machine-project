import { describe, it, expect } from 'vitest';
import { CustomerOrder, CustomerOrderToDrinkMakerTranslator, DRINK_TYPE } from '.';

type TranslateTestCase = CustomerOrder & { expected: string };

describe('CustomerOrderToDrinkMakerTranslator', () => {
  it.each<TranslateTestCase>([
    { drinkType: DRINK_TYPE.tea, sugar: 0, expected: 'T::' },
    { drinkType: DRINK_TYPE.chocolate, sugar: 0, expected: 'H::' },
    { drinkType: DRINK_TYPE.coffee, sugar: 0, expected: 'C::' },
  ])(
    'should translate customer order when drinkType is $drinkType',
    ({ drinkType, sugar, expected }) => {
      // GIVEN
      const order: CustomerOrder = {
        drinkType,
        sugar,
      };

      // WHEN
      const result = CustomerOrderToDrinkMakerTranslator.translate(order);

      // THEN
      expect(result).toEqual(expected);
    },
  );
  it.each<TranslateTestCase>([
    { drinkType: DRINK_TYPE.tea, sugar: 1, expected: 'T:1:0' },
    { drinkType: DRINK_TYPE.chocolate, sugar: 1, expected: 'H:1:0' },
    { drinkType: DRINK_TYPE.coffee, sugar: 1, expected: 'C:1:0' },
    { drinkType: DRINK_TYPE.tea, sugar: 2, expected: 'T:2:0' },
    { drinkType: DRINK_TYPE.chocolate, sugar: 2, expected: 'H:2:0' },
    { drinkType: DRINK_TYPE.coffee, sugar: 2, expected: 'C:2:0' },
  ])('should add a stick when order contains sugar: $sugar', ({ drinkType, sugar, expected }) => {
    // GIVEN
    const order: CustomerOrder = {
      drinkType,
      sugar,
    };

    // WHEN
    const result = CustomerOrderToDrinkMakerTranslator.translate(order);

    // THEN
    expect(result).toEqual(expected);
  });
});
