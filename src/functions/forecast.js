import {
  add,
  addIndex,
  concat,
  dec,
  head,
  inc,
  map,
  mean,
  subtract,
  last,
  length,
  prop,
  pluck,
  times,
} from 'ramda'

const forecast = (historicalData, daysLeft) => {
  const averageMovement = mean(
    addIndex(map)((balance, i, arr) =>
      subtract(balance, arr[dec(i)] || 0),
    )(pluck('balance', historicalData)),
  )

  return concat(
    historicalData,
    times(
      i => ({
        day: add(inc(i), prop('day', last(historicalData))),
      }),
      daysLeft,
    ).reduce((acc, curr, i, arr) => {
      acc.push({
        ...curr,
        balance: add(
          averageMovement,
          prop('balance')(
            acc[dec(i)]
              ? acc[dec(i)]
              : last(historicalData),
          ),
        ),
      })
      return acc
    }, []),
  )
}

export default forecast
