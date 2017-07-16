import React from 'react'

import { length } from 'ramda'

import processData from './data-processor'

const oneSentence = `dagger-hashimoto ETH balance of 0.00144203 added to your account on 2017-07-14T12:00:00+00:00`
const fromCurrency = 'GBP'
const toCurrency = 'BTC'
const mockData = [{ open: 1 }]

window.fetch = jest.fn(url =>
  Promise.resolve({
    json: () => Promise.resolve({ Data: mockData }),
  })
)

it(`Calls fetch with the 'to' and 'from' currencies`, () => {
  processData(oneSentence, { fromCurrency, toCurrency })
  expect(window.fetch.mock.calls[0][0]).toMatch(
    new RegExp(
      `.*${fromCurrency}.*${toCurrency}.*${length(mockData)}`
    )
  )
})

it('Resolves with an average of the balances', () => {
  processData(oneSentence, {
    fromCurrency,
    toCurrency,
  }).then(({ average }) =>
    expect(average).toEqual(0.00144203)
  )
})
