import R from 'ramda'
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
    const totalEth = R.pipe(R.pluck('balance'), R.sum)(data)
    const average = R.mean(R.pluck('balance')(data))

    fetch(
      stringMerge(HISTORY_URL, {
        fromCurrency,
        toCurrency,
        limit: data.length,
      })
    ).then(response => {
      return response.json().then(json => {
        const projectedReturn = R.subtract(
          R.multiply(daysLeft, average, oneEthInGbp),
          contractCostInGbp
        )
        const accruedPayback = R.multiply(
          totalEth,
          oneEthInGbp
        ).toFixed(2)

        resolve({
          data,
          average,
          totalEth,
          oneEthInGbp,
          ethGbpData: json.Data.map(
            ({ open: price }, i) => ({
              price,
              day: i,
            })
          ),
          averagePerDayProfitGbp: R.multiply(
            average,
            oneEthInGbp
          ).toFixed(2),
          accruedPayback,
          accruedPaybackAsPercentage: R.multiply(
            R.divide(contractCostInGbp, 100),
            accruedPayback
          ),
          daysLeft: R.subtract(
            R.multiply(365, 2),
            data.length
          ),
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
