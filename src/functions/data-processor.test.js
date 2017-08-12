import React from 'react'
import { length } from 'ramda'
import processData from './data-processor'
const twoSentences = `dagger-hashimoto ETH balance of 1 added to your account on 2017-07-14T12:00:00+00:00\ndagger-hashimoto ETH balance of 2 added to your account on 2017-07-14T12:00:00+00:00`
const minedCurrencyCode = 'ETH'
const analysisCurrencyCode = 'GBP'
const mockData = [
  { open: 1, price: 1 },
  { open: 1, price: 1 },
]

window.fetch = jest.fn(url =>
  Promise.resolve({
    json: () => Promise.resolve({ Data: mockData }),
  }),
)

it(`Calls fetch with the 'mined' and 'analysis' currencies`, () => {
  processData(twoSentences, {
    minedCurrencyCode,
    analysisCurrencyCode,
  })
  expect(window.fetch.mock.calls[0][0]).toMatch(
    new RegExp(
      `.*${minedCurrencyCode}.*${analysisCurrencyCode}.*${length(
        mockData,
      )}`,
    ),
  )
})

it('Resolves with an average of the balances', () => {
  processData(twoSentences, {
    exchangeRate: 1,
    minedCurrencyCode,
    analysisCurrencyCode,
  }).then(({ average }) => expect(average).toEqual(1.5))
})

it('Resolves with an average of the balances', () => {
  processData(twoSentences, {
    exchangeRate: 1,
    minedCurrencyCode,
    analysisCurrencyCode,
  }).then(({ accruedPayback }) =>
    expect(accruedPayback).toEqual(3),
  )
})
