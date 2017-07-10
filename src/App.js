import React, { Component } from 'react'
import './App.css'
import Chart from './Chart'
import mockData from './mock-data'
import { Line } from 'recharts'
import R from 'ramda'
import { stringMerge } from './string'

const HISTORY_URL =
  'https://min-api.cryptocompare.com/data/histoday?fsym={fromCurrency}&tsym={toCurrency}&limit={limit}&aggregate=3&e=CCCAGG'
const PRICE_URL =
  'https://min-api.cryptocompare.com/data/price?fsym={fromCurrency}&tsyms={toCurrency}'

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      average: 0,
      averageInGbp: 0,
      oneEthInGbp: 0,
      totalEth: 0,
      ethGbpData: [],
      fromCurrency: 'ETH',
      toCurrency: 'GBP',
    }
    this.handleChange = this.handleChange.bind(this)
    this.processData = this.processData.bind(this)
  }

  componentDidMount() {
    fetch(
      stringMerge(PRICE_URL, {
        fromCurrency: this.state.fromCurrency,
        toCurrency: this.state.toCurrency,
      })
    ).then(response => {
      return response.json().then(json => {
        this.setState({
          oneEthInGbp: json.GBP,
        })
        this.processData(mockData)
      })
    })
  }

  processData(str) {
    const data = str.split('\n').reverse().map(row => {
      const splitRow = row.split(' ')
      return {
        currency: splitRow[1],
        balance: splitRow[4],
        date: splitRow[10],
      }
    })
    const totalEth = R.pipe(R.pluck('balance'), R.sum)(data)
    const average = R.mean(R.pluck('balance')(data))

    fetch(
      stringMerge(HISTORY_URL, {
        fromCurrency: this.state.fromCurrency,
        toCurrency: this.state.toCurrency,
        limit: data.length,
      })
    ).then(response => {
      return response.json().then(json => {
        this.setState({
          data,
          average,
          totalEth,
          ethGbpData: json.Data.map(
            ({ open: price }, i) => ({
              price,
              day: i,
            })
          ),
        })
      })
    })
  }

  handleChange(event) {
    this.processData(event.target.value)
  }

  get rows() {
    return this.state.data.map(o => (
      <p className="rows">{o.balance}</p>
    ))
  }

  render() {
    const { state } = this
    const contractCostInGbp = 100
    const averagePerDayProfitGbp = R.multiply(
      state.average,
      state.oneEthInGbp
    ).toFixed(2)
    const accruedPayback = R.multiply(
      state.totalEth,
      state.oneEthInGbp
    ).toFixed(2)
    const accruedPaybackAsPercentage = R.multiply(
      R.divide(contractCostInGbp, 100),
      accruedPayback
    )
    const daysLeft = R.subtract(
      R.multiply(365, 2),
      state.data.length
    )
    const projectedReturn = R.subtract(
      R.multiply(
        daysLeft,
        state.average,
        state.oneEthInGbp
      ),
      contractCostInGbp
    )
    const projectedProfitPercent =
      contractCostInGbp / 100 * projectedReturn
    const historyData = state.data
      .slice()
      .map(({ balance }, i) => {
        const { data } = state
        const sumOfPreviousDays = R.pipe(
          R.pluck('balance'),
          R.sum
        )(data.slice(0, i))
        return {
          day: i + 1,
          balance: +balance,
          gbpValue: R.find(R.propEq('day', i))(
            state.ethGbpData
          ).price,
          average: R.divide(sumOfPreviousDays, i) ||
            +balance,
        }
      })

    let forecastData = []
    if (historyData.length) {
      const emptyArr = new Array(
        daysLeft - state.data.length
      ).fill(0)
      const historicalMovements = state.data.map(
        ({ balance }, i, arr) =>
          balance - (arr[i - 1] || arr[0]).balance
      )
      const averageMovement =
        R.sum(historicalMovements) /
        historicalMovements.length

      let prevBalance =
        state.data[state.data.length - 1].balance
      const _foreCastData = emptyArr.map((item, i) => {
        const balance = +averageMovement + +prevBalance
        prevBalance = balance
        return {
          day: state.data.length + i,
          balance,
        }
      })
      forecastData = historyData.concat(_foreCastData)
    }

    return (
      <div>
        <h1>
          Crypto mining contract analysis and forecasting
        </h1>
        <div className="input">

          <p>
            Show stats in:
            {' '}
            <select>
              <option defaultValue>
                {this.state.toCurrency}
              </option>
            </select>
          </p>
          <p>
            Paste in your orders data from
            {' '}
            <a href="https://www.genesis-mining.com/my-orders">
              genesis-mining.com/my-orders
            </a>:
          </p>
          <textarea
            cols="120"
            rows="10"
            onChange={this.handleChange}
            value={mockData}
          />
          <p>
            How much did your contract cost?
            {' '}
            <input readOnly value={contractCostInGbp} />
            <select>
              <option defaultValue>GBP</option>
            </select>
          </p>
          <p>
            When does your contract end?
            {' '}
            <input
              type="date"
              readOnly
              value="2019-06-16"
            />
          </p>
        </div>
        <div className="output">
          <h2>Statistics</h2>
          <p>
            Average payback per day: <strong>
              {averagePerDayProfitGbp}GBP (
              {this.state.average.toFixed(4)}
              ETH ) over {state.data.length} days
            </strong>
          </p>
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
          <Chart
            data={historyData}
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

          <Chart
            data={historyData}
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

          <Chart
            data={this.state.ethGbpData}
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
          <h2>Forecasting</h2>
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
            {state.oneEthInGbp}
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

      </div>
    )
  }
}

export default App
