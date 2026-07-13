import { describe, it, expect } from 'vitest';
import {
  CustomerOrder,
  CustomerOrderToDrinkMakerTranslator,
  DRINK_AMOUNT_MAPPER,
  DRINK_TYPE,
  DrinkAmount,
  DrinkType,
} from '.';

describe('CustomerOrderToDrinkMakerTranslator', () => {
  describe('handleCustomerOrder', () => {
    type HandleCustomerOrderType = {
      order: CustomerOrder;
      insertedAmount: number;
      expected: string;
    };

    it.each<HandleCustomerOrderType>([
      {
        order: {
          drinkType: DRINK_TYPE.tea,
          sugar: 0,
        },
        insertedAmount: 40,
        expected: 'T::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.chocolate,
          sugar: 0,
        },
        insertedAmount: 50,
        expected: 'H::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.coffee,
          sugar: 0,
        },
        insertedAmount: 60,
        expected: 'C::',
      },
    ])(
      'should handle customer order when drinkType is $order.drinkType',
      ({ order, insertedAmount, expected }) => {
        // GIVEN
        // WHEN
        const result = CustomerOrderToDrinkMakerTranslator.handleCustomerOrder({
          order,
          insertedAmount,
        });

        // THEN
        expect(result).toEqual(expected);
      },
    );
    it('should return a message when missing amount', () => {
      // GIVEN
      const order: CustomerOrder = {
        drinkType: DRINK_TYPE.tea,
        sugar: 0,
      };
      const insertedAmount = 10;

      // WHEN
      const result = CustomerOrderToDrinkMakerTranslator.handleCustomerOrder({
        order,
        insertedAmount,
      });

      // THEN
      expect(result).toEqual('M:Missing amount: 30 cents');
    });
  });
  describe('getDrinkAmountInCents', () => {
    type GetDrinkAmountInCentsTestCase = { drinkType: DrinkType; expected: number };

    it.each<GetDrinkAmountInCentsTestCase>([
      { drinkType: DRINK_TYPE.tea, expected: 40 },
      { drinkType: DRINK_TYPE.chocolate, expected: 50 },
      { drinkType: DRINK_TYPE.coffee, expected: 60 },
    ])('should get $drinkType amount in cents', ({ drinkType, expected }) => {
      // GIVEN
      // WHEN
      const result = CustomerOrderToDrinkMakerTranslator.getDrinkAmountInCents(drinkType);

      // THEN
      expect(result).toEqual(expected);
    });
  });
  describe('validateInsertedAmount', () => {
    type ValidateTestCase = {
      drinkAmount: DrinkAmount;
      description: string;
      insertedAmount: number;
      expected: boolean;
    };

    it.each<ValidateTestCase>([
      {
        description: 'should return true when given inserted amount is equals to tea price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
        insertedAmount: 40,
        expected: true,
      },
      {
        description: 'should return true even when given inserted amount is greater than tea price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
        insertedAmount: 50,
        expected: true,
      },
      {
        description: 'should return false when given inserted amount is insufficient for tea',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
        insertedAmount: 10,
        expected: false,
      },
      {
        description: 'should return true when given inserted amount is equals to chocolate price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.chocolate],
        insertedAmount: 50,
        expected: true,
      },
      {
        description:
          'should return true even when given inserted amount is greater than chocolate price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.chocolate],
        insertedAmount: 60,
        expected: true,
      },
      {
        description: 'should return false when given inserted amount is insufficient for chocolate',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.chocolate],
        insertedAmount: 10,
        expected: false,
      },
      {
        description: 'should return true when given inserted amount is equals to coffee price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.coffee],
        insertedAmount: 60,
        expected: true,
      },
      {
        description:
          'should return true even when given inserted amount is greater than coffee price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.coffee],
        insertedAmount: 70,
        expected: true,
      },
      {
        description: 'should return false when given inserted amount is insufficient for coffee',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.coffee],
        insertedAmount: 10,
        expected: false,
      },
    ])('$description', ({ drinkAmount, insertedAmount, expected }) => {
      // GIVEN
      // WHEN
      const result = CustomerOrderToDrinkMakerTranslator.validateInsertedAmount({
        drinkAmount,
        insertedAmount,
      });

      // THEN
      expect(result).toEqual(expected);
    });
  });
  describe('computeMissingAmount', () => {
    it('should return 0 when given an inserted amount equals to selected drink amount', () => {
      expect(
        CustomerOrderToDrinkMakerTranslator.computeMissingAmount({
          selectedDrinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
          insertedAmount: 40,
        }),
      ).toEqual(0);
    });
    it('should return 0 when given an inserted amount is greater than selected drink amount', () => {
      expect(
        CustomerOrderToDrinkMakerTranslator.computeMissingAmount({
          selectedDrinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
          insertedAmount: 100,
        }),
      ).toEqual(0);
    });
    it('should return diff between selected drink amount & inserted amount', () => {
      expect(
        CustomerOrderToDrinkMakerTranslator.computeMissingAmount({
          selectedDrinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.tea],
          insertedAmount: 10,
        }),
      ).toEqual(30);
    });
  });
  describe('translate', () => {
    type TranslateTestCase = CustomerOrder & { expected: string };

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
});
