import {
  add,
  addIndex,
  concat,
  dec,
  find,
  inc,
  map,
  mean,
  subtract,
  last,
  prop,
  pluck,
  tail,
  times,
} from 'ramda'

const previousBalance = (acc, i, historicalData) =>
  prop('balance')(acc[dec(i)] || last(historicalData))

const forecast = (historicalData, daysLeft) => {
  const balances = pluck('balance', historicalData)
  const movements = addIndex(map)(
    (b, i, arr) => subtract(b, arr[dec(i)]),
    balances,
  )
  const averageMovement = mean(tail(movements))
  const daysList = times(
    i => ({
      day: add(inc(i), prop('day', last(historicalData))),
    }),
    daysLeft,
  )

  const forecastData = daysList.reduce((acc, day, i) => {
    const balance = add(
      averageMovement,
      previousBalance(acc, i, historicalData),
    )
    acc.push({
      ...day,
      balance: balance > 0 ? balance : 0,
    })
    return acc
  }, [])

  const nonProfitDay = find(
    d => d.balance <= 0,
    forecastData,
  )

  return {
    data: concat(historicalData, forecastData),
    nonProfitDay,
  }
}

export default forecast
