import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'
import { mean } from 'ramda'

const forecastData = (historicalData, daysLeft) => {
  let forecastData = []
  if (historicalData.length) {
    const historicalMovements = historicalData.map(
      ({ balance }, i, arr) =>
        balance - (arr[i - 1] || arr[0]).balance
    )
    const averageMovement = mean(
      historicalMovements,
      historicalMovements.length
    )
    let prevBalance =
      historicalData[historicalData.length - 1].balance
    const _forecastData = new Array(
      daysLeft - historicalData.length
    )
      .fill(0)
      .map((item, i) => {
        const balance = +averageMovement + +prevBalance
        prevBalance = balance
        return {
          day: historicalData.length + i,
          balance,
        }
      })
    forecastData = historicalData.concat(_forecastData)
  }
  return forecastData
}

const Forecasting = ({
  projectedProfit,
  projectedProfitPercent,
  daysLeft,
  oneEthInGbp,
  daysLength,
  historicalData,
}) => {
  return (
    <div>
      <h2>Forecasting <span>🤔</span></h2>
      <p>
        Projected profit if ETH/GBP price remains:
        {projectedProfit.toFixed(2)}
        GBP ☀️
        {projectedProfitPercent.toFixed(2)}
        {daysLeft}
        days left)
      </p>
      <sub>
        Based on
        {oneEthInGbp}
        ETH/GBP (
        {new Date()
          .toISOString()
          .replace(/[A-Z]/g, ' ')
          .substring(0, 19)}
        )
      </sub>

      <Chart
        data={forecastData(historicalData, daysLeft)}
        yAxisLabel="ETH"
        legendTitle="ETH mining forecast"
        lines={[
          <Line
            key="a"
            type="monotone"
            dataKey="balance"
            stroke="#4d84d8"
            dot={false}
          />,
        ]}
      />
    </div>
  )
}
export default Forecasting
