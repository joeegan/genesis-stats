import {
  addIndex,
  find,
  propEq,
  divide,
  head,
  inc,
  length,
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
    contractCostInAnalysisCurrency,
    contractLengthInDays,
    minedCurrencyCode,
    analysisCurrencyCode,
  },
) =>
  new Promise(resolve => {
    const dataRows = reverse(split('\n', str))
    const minedCurrencyCode = head(dataRows).split(' ')[1]
    const balances = map(
      sentence => +view(lensIndex(4), split(' ', sentence)),
      dataRows,
    )
    fetch(
      stringMerge(HISTORY_URL, {
        minedCurrencyCode,
        analysisCurrencyCode,
        limit: prop('length', balances),
      }),
    ).then(response => {
      return response.json().then(json => {
        const pricesWithDays = addIndex(map)(
          ({ open: price }, i) => ({
            price,
            day: i,
          }),
          json.Data,
        )
        const totalContractDays = multiply(
          daysInYear,
          contractInYears,
        )
        const daysLeft = subtract(
          totalContractDays,
          length(balances),
        )
        const projectedProfit = subtract(
          multiply(
            totalContractDays,
            multiply(mean(balances), exchangeRate),
          ),
          contractCostInAnalysisCurrency,
        )

        const accruedPayback = multiply(
          sum(balances),
          exchangeRate,
        )
        const historicalData = addIndex(map)(
          (balance, i) => ({
            day: inc(i),
            balance: +balance,
            gbpValue: prop(
              'price',
              find(propEq('day', i), pricesWithDays),
            ),
            average: or(
              divide(sum(slice(0, i, balances)), i),
              +balance,
            ),
          }),
          balances,
        )

        resolve({
          minedCurrencyCode,
          historicalData,
          average: mean(balances),
          totalCrypto: sum(balances),
          exchangeRate,
          pricesWithDays,
          averagePerDayProfitInAnalysisCurrency: multiply(
            mean(balances),
            exchangeRate,
          ),
          accruedPayback,
          accruedPaybackAsPercentage: percent(
            accruedPayback,
            contractCostInAnalysisCurrency,
          ),
          daysLeft,
          projectedProfit,
          projectedProfitPercent: percent(
            contractCostInAnalysisCurrency,
            projectedProfit,
          ),
        })
      })
    })
  })

export default processData
