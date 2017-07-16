import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'
import forecast from '../functions/forecast'

const Forecasting = ({
  projectedProfit,
  projectedProfitPercent,
  daysLeft,
  oneEthInGbp,
  daysLength,
  historicalData,
}) => (
  <div>
    <h2>Forecasting <span>🤔</span></h2>
    <p>
      Projected profit if ETH/GBP price remains:
      {projectedProfit.toFixed(2)}
      GBP <span>☀️</span>
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
      data={forecast(historicalData, daysLeft)}
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
export default Forecasting
