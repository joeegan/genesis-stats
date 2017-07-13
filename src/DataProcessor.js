import {
  find,
  propEq,
  divide,
  multiply,
  mean,
  subtract,
  pipe,
  pluck,
  sum,
} from 'ramda'
import { stringMerge } from './string'
const HISTORY_URL =
  'https://min-api.cryptocompare.com/data/histoday?fsym={fromCurrency}&tsym={toCurrency}&limit={limit}&aggregate=3&e=CCCAGG'

const processData = (
  str,
  {
    oneEthInGbp,
    daysLeft,
    contractCostInGbp,
    fromCurrency,
    toCurrency,
  }
) => {
  return new Promise((resolve, reject) => {
    const data = str.split('\n').reverse().map(row => {
      const splitRow = row.split(' ')
      return {
        currency: splitRow[1],
        balance: splitRow[4],
        date: splitRow[10],
      }
    })
    const totalEth = pipe(pluck('balance'), sum)(data)
    const average = mean(pluck('balance')(data))

    fetch(
      stringMerge(HISTORY_URL, {
        fromCurrency,
        toCurrency,
        limit: data.length,
      })
    ).then(response => {
      return response.json().then(json => {
        const projectedReturn = subtract(
          multiply(daysLeft, average, oneEthInGbp),
          contractCostInGbp
        )
        const accruedPayback = multiply(
          totalEth,
          oneEthInGbp
        ).toFixed(2)

        const ethGbpData = json.Data.map(
          ({ open: price }, i) => ({
            price,
            day: i,
          })
        )

        resolve({
          historicalData: data
            .slice()
            .map(({ balance }, i) => {
              const sumOfPreviousDays = pipe(
                pluck('balance'),
                sum
              )(data.slice(0, i))
              return {
                day: i + 1,
                balance: +balance,
                gbpValue: find(propEq('day', i))(ethGbpData)
                  .price,
                average: divide(sumOfPreviousDays, i) ||
                  +balance,
              }
            }),
          average,
          totalEth,
          oneEthInGbp,
          ethGbpData,
          averagePerDayProfitGbp: multiply(
            average,
            oneEthInGbp
          ).toFixed(2),
          accruedPayback,
          accruedPaybackAsPercentage: multiply(
            divide(contractCostInGbp, 100),
            accruedPayback
          ),
          daysLeft: subtract(multiply(365, 2), data.length),
          projectedReturn,
          projectedProfitPercent: contractCostInGbp /
            100 *
            projectedReturn,
        })
      })
    })
  })
}

export default processData
