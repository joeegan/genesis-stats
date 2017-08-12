import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'

const Statistics = ({
  accruedPayback,
  accruedPaybackAsPercentage,
  averagePerDayProfitGbp,
  average,
  minedCurrencyCode,
  daysLength,
  historicalData,
  pricesWithDays,
}) => {
  return (
    <div>
      <h2>
        Statistics{' '}
        <span role="img" aria-label="statistics">
          📈
        </span>
      </h2>
      <p>
        Current accrued payback: {accruedPayback.toFixed(2)}{' '}
        GBP {accruedPaybackAsPercentage.toFixed(2)}
        %
      </p>
      <p>
        Average payback per day:{' '}
        <strong>
          {averagePerDayProfitGbp.toFixed(2)}GBP (
          {average.toFixed(4)}
          ETH) over {daysLength} days
        </strong>
      </p>
      {miningHistoryPerDayChart(
        historicalData,
        minedCurrencyCode,
      )}
      {miningHistoryInToCurrencyChart(
        historicalData,
        minedCurrencyCode,
      )}
    </div>
  )
}
const miningHistoryPerDayChart = (
  data,
  minedCurrencyCode,
) => {
  return (
    <Chart
      data={data}
      yAxisLabel={minedCurrencyCode}
      legendTitle={`${minedCurrencyCode} mining history per day`}
      lines={[
        <Line
          key="a"
          type="monotone"
          dataKey="balance"
          stroke="#8884d8"
        />,
        <Line
          key="b"
          type="monotone"
          dataKey="average"
          stroke="#4d84d8"
          dot={false}
        />,
      ]}
    />
  )
}
const miningHistoryInToCurrencyChart = (
  data,
  minedCurrencyCode,
) => {
  return (
    <Chart
      data={data}
      yAxisLabel="GBP"
      legendTitle={`GBP value of ${minedCurrencyCode} mining per day`}
      lines={[
        <Line
          key="a"
          type="monotone"
          dataKey="gbpValue"
          stroke="#4d84d8"
          dot={false}
        />,
      ]}
    />
  )
}

export default Statistics
