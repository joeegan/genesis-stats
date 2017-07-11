import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'

const Statistics = ({
  accruedPayback,
  accruedPaybackAsPercentage,
  averagePerDayProfitGbp,
  average,
  daysLength,
  historyData,
  ethGbpData,
}) => {
  return (
    <div>
      <h2>Statistics <span>📈</span></h2>
      <p>
        Current accrued payback:
        {' '}
        {accruedPayback}
        {' '}
        GBP
        {' '}
        {accruedPaybackAsPercentage}
        %
      </p>
      <p>
        Average payback per day: <strong>
          {averagePerDayProfitGbp}GBP (
          {average.toFixed(4)}
          ETH ) over {daysLength} days
        </strong>
      </p>
      {miningHistoryPerDayChart(historyData)}
      {miningHistoryInToCurrencyChart(historyData)}
      {toFromPairSinceContractAquired(ethGbpData)}
    </div>
  )
}
const miningHistoryPerDayChart = data => {
  return (
    <Chart
      data={data}
      yAxisLabel="ETH"
      legendTitle="ETH mining history per day"
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
const miningHistoryInToCurrencyChart = data => {
  return (
    <Chart
      data={data}
      yAxisLabel="GBP"
      legendTitle="GBP value of ETH mining per day"
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
const toFromPairSinceContractAquired = data => {
  return (
    <Chart
      data={data}
      yAxisLabel="GBP"
      legendTitle="ETH/GBP since contract acquired"
      lines={[
        <Line
          key="a"
          type="monotone"
          dataKey="price"
          stroke="#4d84d8"
          dot={false}
        />,
      ]}
    />
  )
}
export default Statistics
