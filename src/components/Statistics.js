import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'

const Statistics = ({
  analysisCurrencyCode,
  accruedPayback,
  accruedPaybackAsPercentage,
  averagePerDayProfitInAnalysisCurrency,
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
        {analysisCurrencyCode}{' '}
        {accruedPaybackAsPercentage.toFixed(2)}
        %
      </p>
      <p>
        Average payback per day:{' '}
        <strong>
          {averagePerDayProfitInAnalysisCurrency.toFixed(2)}
          {analysisCurrencyCode} (
          {average.toFixed(4)}
          {analysisCurrencyCode}) over {daysLength} days
        </strong>
      </p>
      {miningHistoryPerDayChart(
        historicalData,
        analysisCurrencyCode,
        minedCurrencyCode,
      )}
      {miningHistoryInToCurrencyChart(
        historicalData,
        analysisCurrencyCode,
        minedCurrencyCode,
      )}
    </div>
  )
}
const miningHistoryPerDayChart = (
  data,
  analysisCurrencyCode,
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
  analysisCurrencyCode,
  minedCurrencyCode,
) => {
  return (
    <Chart
      data={data}
      yAxisLabel={analysisCurrencyCode}
      legendTitle={`${analysisCurrencyCode} value of ${minedCurrencyCode} mining per day`}
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
