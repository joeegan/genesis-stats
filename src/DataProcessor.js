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
  pipe,
  pluck,
  prop,
  reverse,
  sum,
  split,
  slice,
  view,
  lensIndex,
} from 'ramda'

import { stringMerge } from './string'

const HISTORY_URL =
  'https://min-api.cryptocompare.com/data/histoday?fsym={fromCurrency}&tsym={toCurrency}&limit={limit}&aggregate=3&e=CCCAGG'
const daysInYear = 365
const contractInYears = 2

const processData = (
  str, // the sentence data pasted into the input
  {
    oneEthInGbp,
    daysLeft,
    contractCostInGbp,
    fromCurrency,
    toCurrency,
  }
) =>
  new Promise(resolve => {
    const balances = map(
      sentence => view(lensIndex(4), split(' ', sentence)),
      reverse(split('\n', str))
    )
    fetch(
      stringMerge(HISTORY_URL, {
        fromCurrency,
        toCurrency,
        limit: prop('length', balances),
      })
    ).then(response => {
      return response.json().then(json => {
        const projectedProfit = subtract(
          multiply(daysLeft, mean(balances), oneEthInGbp),
          contractCostInGbp
        )
        const accruedPayback = multiply(
          sum(balances),
          oneEthInGbp
        )
        const ethGbpData = addIndex(map)(
          ({ open: price }, i) => ({
            price,
            day: i,
          }),
          json.Data
        )

        resolve({
          historicalData: addIndex(map)((balance, i) => {
            return {
              day: inc(i),
              balance: +balance,
              gbpValue: prop(
                'price',
                find(propEq('day', i), ethGbpData)
              ),
              average: or(
                divide(sum(slice(0, i, balances)), i),
                +balance
              ),
            }
          }, balances),
          average: mean(balances),
          totalEth: sum(balances),
          oneEthInGbp,
          ethGbpData,
          averagePerDayProfitGbp: multiply(
            mean(balances),
            oneEthInGbp
          ),
          accruedPayback,
          accruedPaybackAsPercentage: multiply(
            divide(contractCostInGbp, 100),
            accruedPayback
          ),
          daysLeft: subtract(
            multiply(daysInYear, contractInYears),
            prop('length', balances)
          ),
          projectedProfit,
          projectedProfitPercent: divide(
            contractCostInGbp,
            multiply(100, projectedProfit)
          ),
        })
      })
    })
  })

export default processData
