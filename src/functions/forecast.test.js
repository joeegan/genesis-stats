import React from 'react'
import {
  add,
  length,
  addIndex,
  map,
  reverse,
  filter,
  pluck,
  prop,
  last,
} from 'ramda'
import forecast from './forecast'

describe('ascending data', () => {
  const historicalData = addIndex(map)(
    (balance, i) => ({ balance, day: i }),
    [1, 2, 3, 4],
  )

  it(`Concats existing historical data with the days left`, () => {
    expect(forecast(historicalData, 3).data).toHaveLength(
      add(length(historicalData), 3),
    )
  })

  it('Maintains a day property for all data', () => {
    expect(
      pluck('day', forecast(historicalData, 3).data),
    ).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('Predicts realistic data', () => {
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 1).data),
      ),
    ).toEqual(5)
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 3).data),
      ),
    ).toEqual(7)
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 1000).data),
      ),
    ).toEqual(1004)
  })
})

describe('descending data', () => {
  const historicalData = addIndex(map)(
    (balance, i) => ({ balance, day: i }),
    [10, 9, 8, 7],
  )

  it(`Concats existing historical data with the days left`, () => {
    expect(forecast(historicalData, 3).data).toHaveLength(
      add(length(historicalData), 3),
    )
  })

  it('Maintains a day property for all data', () => {
    expect(
      pluck('day', forecast(historicalData, 3).data),
    ).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('Predicts realistic data', () => {
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 1).data),
      ),
    ).toEqual(6)
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 3).data),
      ),
    ).toEqual(4)
    expect(
      prop(
        'balance',
        last(forecast(historicalData, 1000).data),
      ),
    ).toEqual(0) // minus numbers should just resolve to 0
  })
})
