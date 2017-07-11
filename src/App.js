import React, { Component } from 'react'
import './App.css'
import Statistics from './components/Statistics'
import Forecasting from './components/Forecasting'
import Form from './components/Form'
import R from 'ramda'
import mockData from './mock-data'
import processData from './DataProcessor'
import { stringMerge } from './string'

const EXCHANGE_RATE_URL =
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
      contractCostInGbp: 100,
      averagePerDayProfitGbp: 0,
      accruedPayback: 0,
      accruedPaybackAsPercentage: 0,
      daysLeft: 0,
      projectedReturn: 0,
      projectedProfitPercent: 0,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { state } = this
    const daysLeft = R.subtract(
      R.multiply(365, 2),
      state.data.length
    )
    fetch(
      stringMerge(EXCHANGE_RATE_URL, {
        fromCurrency: state.fromCurrency,
        toCurrency: state.toCurrency,
      })
    ).then(exchangeRateData => {
      return exchangeRateData.json().then(json => {
        processData(mockData, {
          oneEthInGbp: json.GBP,
          daysLeft,
          contractCostInGbp: state.contractCostInGbp,
          fromCurrency: state.fromCurrency,
          toCurrency: state.toCurrency,
        }).then(data => this.setState(data))
      })
    })
  }

  handleChange({ target }) {
    processData(target.value).then(data =>
      this.setState(data)
    )
  }

  // TODO: Move from here
  get historyData() {
    return this.state.data.slice().map(({ balance }, i) => {
      const { data } = this.state
      const sumOfPreviousDays = R.pipe(
        R.pluck('balance'),
        R.sum
      )(data.slice(0, i))
      return {
        day: i + 1,
        balance: +balance,
        gbpValue: R.find(R.propEq('day', i))(
          this.state.ethGbpData
        ).price,
        average: R.divide(sumOfPreviousDays, i) || +balance,
      }
    })
  }

  get rows() {
    return this.state.data.map(o => (
      <p className="rows">{o.balance}</p>
    ))
  }

  render() {
    // TODO move all non rendering away from here
    const { state } = this
    let forecastData = []
    if (this.historyData.length) {
      const emptyArr = new Array(
        state.daysLeft - state.data.length
      ).fill(0)
      const historicalMovements = state.data.map(
        ({ balance }, i, arr) =>
          balance - (arr[i - 1] || arr[0]).balance
      )
      const averageMovement = R.mean(
        historicalMovements,
        historicalMovements.length
      )

      let prevBalance =
        state.data[state.data.length - 1].balance
      const _forecastData = emptyArr.map((item, i) => {
        const balance = +averageMovement + +prevBalance
        prevBalance = balance
        return {
          day: state.data.length + i,
          balance,
        }
      })
      forecastData = this.historyData.concat(_forecastData)
    }

    return (
      <div>
        <Form
          toCurrency={this.state.toCurrency}
          handleChange={this.handleChange}
          contractCostInGbp={state.contractCostInGbp}
        />
        <div className="output">
          <Statistics
            accruedPayback={state.accruedPayback}
            accruedPaybackAsPercentage={
              state.accruedPaybackAsPercentage
            }
            averagePerDayProfitGbp={
              state.averagePerDayProfitGbp
            }
            average={state.average}
            daysLength={state.data.length}
            historyData={this.historyData}
            ethGbpData={state.ethGbpData}
          />
          <Forecasting
            projectedReturn={state.projectedReturn}
            projectedProfitPercent={
              state.projectedProfitPercent
            }
            daysLeft={state.daysLeft}
            oneEthInGbp={state.oneEthInGbp}
            daysLength={state.data.length}
            forecastData={forecastData}
          />
        </div>
      </div>
    )
  }
}
export default App
