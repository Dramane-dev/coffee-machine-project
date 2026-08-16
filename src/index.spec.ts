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
          isExtraHot: false,
        },
        insertedAmount: 40,
        expected: 'T::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.chocolate,
          sugar: 0,
          isExtraHot: false,
        },
        insertedAmount: 50,
        expected: 'H::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.coffee,
          sugar: 0,
          isExtraHot: false,
        },
        insertedAmount: 60,
        expected: 'C::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.orange,
          sugar: 0,
          isExtraHot: false,
        },
        insertedAmount: 60,
        expected: 'O::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.tea,
          sugar: 0,
          isExtraHot: true,
        },
        insertedAmount: 40,
        expected: 'Th::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.chocolate,
          sugar: 0,
          isExtraHot: true,
        },
        insertedAmount: 50,
        expected: 'Hh::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.coffee,
          sugar: 0,
          isExtraHot: true,
        },
        insertedAmount: 60,
        expected: 'Ch::',
      },
      {
        order: {
          drinkType: DRINK_TYPE.orange,
          sugar: 0,
          isExtraHot: true,
        },
        insertedAmount: 60,
        expected: 'Oh::',
      },
    ])(
      'should handle customer order when drinkType is $order.drinkType and isExtraHot equals to $order.isExtraHot',
      ({ order, insertedAmount, expected }) => {
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
        isExtraHot: false,
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
      { drinkType: DRINK_TYPE.orange, expected: 60 },
    ])('should get $drinkType amount in cents', ({ drinkType, expected }) => {
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
        insertedAmount: 70,
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
          'should return true even when given inserted amount is greater than orange juice price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.orange],
        insertedAmount: 70,
        expected: true,
      },
      {
        description:
          'should return false when given inserted amount is insufficient for orange juice',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.orange],
        insertedAmount: 10,
        expected: false,
      },
      {
        description:
          'should return true when given inserted amount is equals to orange juice price',
        drinkAmount: DRINK_AMOUNT_MAPPER[DRINK_TYPE.orange],
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
    type TranslateTestCase = { order: CustomerOrder; expected: string };

    it.each<TranslateTestCase>([
      { order: { drinkType: DRINK_TYPE.tea, isExtraHot: false, sugar: 0 }, expected: 'T::' },
      { order: { drinkType: DRINK_TYPE.chocolate, isExtraHot: false, sugar: 0 }, expected: 'H::' },
      { order: { drinkType: DRINK_TYPE.coffee, isExtraHot: false, sugar: 0 }, expected: 'C::' },
      { order: { drinkType: DRINK_TYPE.orange, isExtraHot: false, sugar: 0 }, expected: 'O::' },
      { order: { drinkType: DRINK_TYPE.tea, isExtraHot: true, sugar: 0 }, expected: 'Th::' },
      { order: { drinkType: DRINK_TYPE.chocolate, isExtraHot: true, sugar: 0 }, expected: 'Hh::' },
      { order: { drinkType: DRINK_TYPE.coffee, isExtraHot: true, sugar: 0 }, expected: 'Ch::' },
      { order: { drinkType: DRINK_TYPE.orange, isExtraHot: true, sugar: 0 }, expected: 'Oh::' },
    ])(
      'should translate customer order when drinkType is $order.drinkType and isExtraHot equals to $order.isExtraHot',
      ({ order, expected }) => {
        // WHEN
        const result = CustomerOrderToDrinkMakerTranslator.translate(order);

        // THEN
        expect(result).toEqual(expected);
      },
    );
    it.each<TranslateTestCase>([
      { order: { drinkType: DRINK_TYPE.tea, sugar: 1, isExtraHot: false }, expected: 'T:1:0' },
      {
        order: { drinkType: DRINK_TYPE.chocolate, sugar: 1, isExtraHot: false },
        expected: 'H:1:0',
      },
      { order: { drinkType: DRINK_TYPE.coffee, sugar: 1, isExtraHot: false }, expected: 'C:1:0' },
      { order: { drinkType: DRINK_TYPE.orange, sugar: 1, isExtraHot: false }, expected: 'O:1:0' },
      { order: { drinkType: DRINK_TYPE.tea, sugar: 2, isExtraHot: false }, expected: 'T:2:0' },
      {
        order: { drinkType: DRINK_TYPE.chocolate, sugar: 2, isExtraHot: false },
        expected: 'H:2:0',
      },
      { order: { drinkType: DRINK_TYPE.coffee, sugar: 2, isExtraHot: false }, expected: 'C:2:0' },
      { order: { drinkType: DRINK_TYPE.orange, sugar: 2, isExtraHot: false }, expected: 'O:2:0' },
      { order: { drinkType: DRINK_TYPE.tea, sugar: 1, isExtraHot: true }, expected: 'Th:1:0' },
      {
        order: { drinkType: DRINK_TYPE.chocolate, sugar: 1, isExtraHot: true },
        expected: 'Hh:1:0',
      },
      { order: { drinkType: DRINK_TYPE.coffee, sugar: 1, isExtraHot: true }, expected: 'Ch:1:0' },
      { order: { drinkType: DRINK_TYPE.orange, sugar: 1, isExtraHot: true }, expected: 'Oh:1:0' },
      { order: { drinkType: DRINK_TYPE.tea, sugar: 2, isExtraHot: true }, expected: 'Th:2:0' },
      {
        order: { drinkType: DRINK_TYPE.chocolate, sugar: 2, isExtraHot: true },
        expected: 'Hh:2:0',
      },
      { order: { drinkType: DRINK_TYPE.coffee, sugar: 2, isExtraHot: true }, expected: 'Ch:2:0' },
      { order: { drinkType: DRINK_TYPE.orange, sugar: 2, isExtraHot: true }, expected: 'Oh:2:0' },
    ])(
      'should add a stick when $order.drinkType order contains sugar: $order.sugar and extra hot : $order.isExtraHot',
      ({ order, expected }) => {
        // WHEN
        const result = CustomerOrderToDrinkMakerTranslator.translate(order);

        // THEN
        expect(result).toEqual(expected);
      },
    );
  });
});
