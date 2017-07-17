import React from 'react'
import {
  add,
  length,
  addIndex,
  map,
  filter,
  pluck,
  prop,
  last,
} from 'ramda'
import forecast from './forecast'

const historicalData = addIndex(map)(
  (balance, i) => ({ balance, day: i }),
  [1, 2, 3, 4],
)

it(`Concats existing historical data with the days left`, () => {
  expect(forecast(historicalData, 3)).toHaveLength(
    add(length(historicalData), 3),
  )
})

it('Maintains a day property for all data', () => {
  expect(
    pluck('day', forecast(historicalData, 3)),
  ).toEqual([0, 1, 2, 3, 4, 5, 6])
})

it('Predicts realistic data', () => {
  expect(
    prop('balance', last(forecast(historicalData, 1))),
  ).toEqual(5)
  expect(
    prop('balance', last(forecast(historicalData, 3))),
  ).toEqual(7)
  expect(
    prop('balance', last(forecast(historicalData, 1000))),
  ).toEqual(1004)
})
