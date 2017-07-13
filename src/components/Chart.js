import React from 'react'
import '../App.css'
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

const Chart = ({
  data,
  xAxisLabel,
  xDataKey,
  yAxisLabel,
  legendTitle,
  lines,
}) => {
  return (
    <ResponsiveContainer width="100%" height={800}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis
          label={xAxisLabel || 'Days'}
          height={100}
          dataKey={xDataKey || 'day'}
        />
        <YAxis
          label={yAxisLabel}
          orientation="right"
          width={60}
        />
        <Tooltip />
        <Legend
          content={() => legendTitle}
          verticalAlign="top"
          align="center"
          height={30}
        />
        <CartesianGrid strokeDasharray="3 3" />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
