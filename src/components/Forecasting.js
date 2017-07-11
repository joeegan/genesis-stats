import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'

const Forecasting = ({
  projectedReturn,
  projectedProfitPercent,
  daysLeft,
  oneEthInGbp,
  daysLength,
  forecastData,
}) => {
  return (
    <div>
      <h2>Forecasting <span>🤔</span></h2>
      <p>
        Projected profit if ETH/GBP price remains:
        {projectedReturn.toFixed(2)}
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
        data={forecastData}
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
