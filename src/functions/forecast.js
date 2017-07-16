import {
  add,
  addIndex,
  concat,
  dec,
  head,
  inc,
  map,
  mean,
  or,
  subtract,
  last,
  length,
  prop,
  pluck,
  times,
} from 'ramda'

const forecastData = (historicalData, daysLeft) => {
  const averageMovement = mean(
    addIndex(map)((balance, i, arr) =>
      subtract(balance, arr[dec(i)] || head(arr))
    )(pluck('balance', historicalData))
  )

  let prevBalance = prop('balance', last(historicalData))
  return concat(
    historicalData,
    times((item, i) => {
      const balance = add(+averageMovement, +prevBalance)
      prevBalance = balance
      return {
        day: inc(length(historicalData)),
        balance,
      }
    }, subtract(daysLeft, length(historicalData)))
  )
}

export default forecastData
