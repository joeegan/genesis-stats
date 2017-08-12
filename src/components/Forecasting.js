import React from 'react'
import Chart from './Chart'
import { Line } from 'recharts'
import forecast from '../functions/forecast'

const Forecasting = ({
  minedCurrencyCode,
  projectedProfit,
  projectedProfitPercent,
  daysLeft,
  exchangeRate,
  daysLength,
  historicalData,
}) =>
  <div>
    <h2>Forecasting</h2>
    <p>
      Projected profit if {minedCurrencyCode}/GBP price
      remains:
      {projectedProfit.toFixed(2)}
      GBP
      <span role="img" aria-label="sun emoji">
        ☀️
      </span>
      {projectedProfitPercent.toFixed(2)}%{' '}
      {daysLeft.toFixed(0)} days left
    </p>
    <sub>
      Based on {exchangeRate}
      {minedCurrencyCode}/GBP (
      {new Date()
        .toISOString()
        .replace(/[A-Z]/g, ' ')
        .substring(0, 19)}
      )
    </sub>
    {forecast(historicalData, daysLeft).nonProfitDay &&
      <p>
        Unprofitable on day{' '}
        {
          forecast(historicalData, daysLeft).nonProfitDay
            .day
        }
      </p>}

    <Chart
      data={forecast(historicalData, daysLeft).data}
      yAxisLabel={minedCurrencyCode}
      legendTitle={`${minedCurrencyCode} mining forecast`}
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
export default Forecasting
