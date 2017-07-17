import {
  addIndex,
  find,
  propEq,
  divide,
  inc,
  map,
  multiply,
  mean,
  or,
  subtract,
  prop,
  reverse,
  sum,
  split,
  slice,
  view,
  lensIndex,
} from 'ramda'
import { percent } from './maths'

import { stringMerge } from './string'

const HISTORY_URL =
  'https://min-api.cryptocompare.com/data/histoday?fsym={minedCurrencyCode}&tsym={analysisCurrencyCode}&limit={limit}&aggregate=3&e=CCCAGG'
const daysInYear = 365
const contractInYears = 2

const processData = (
  str, // the sentence data pasted into the input
  {
    exchangeRate,
    daysLeft,
    contractCostInGbp,
    minedCurrencyCode,
    analysisCurrencyCode,
  },
) =>
  new Promise(resolve => {
    const balances = map(
      sentence => +view(lensIndex(4), split(' ', sentence)),
      reverse(split('\n', str)),
    )
    fetch(
      stringMerge(HISTORY_URL, {
        minedCurrencyCode,
        analysisCurrencyCode,
        limit: prop('length', balances),
      }),
    ).then(response => {
      return response.json().then(json => {
        const ethGbpData = addIndex(map)(
          ({ open: price }, i) => ({
            price,
            day: i,
          }),
          json.Data,
        )

        const projectedProfit = subtract(
          multiply(daysLeft, mean(balances), exchangeRate),
          contractCostInGbp,
        )

        console.log('b', balances)
        console.log('exchangeRate', exchangeRate)
        const accruedPayback = multiply(
          sum(balances),
          exchangeRate,
        )

        resolve({
          historicalData: addIndex(map)(
            (balance, i) => ({
              day: inc(i),
              balance: +balance,
              gbpValue: prop(
                'price',
                find(propEq('day', i), ethGbpData),
              ),
              average: or(
                divide(sum(slice(0, i, balances)), i),
                +balance,
              ),
            }),
            balances,
          ),
          average: mean(balances),
          totalEth: sum(balances),
          exchangeRate,
          ethGbpData,
          averagePerDayProfitGbp: multiply(
            mean(balances),
            exchangeRate,
          ),
          accruedPayback,
          accruedPaybackAsPercentage: percent(
            accruedPayback,
            contractCostInGbp,
          ),
          daysLeft: subtract(
            multiply(daysInYear, contractInYears),
            prop('length', balances),
          ),
          projectedProfit,
          projectedProfitPercent: percent(
            contractCostInGbp,
            projectedProfit,
          ),
        })
      })
    })
  })

export default processData
