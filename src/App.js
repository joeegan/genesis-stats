import React, { Component } from 'react'
import './App.css'
import Statistics from './components/Statistics'
import Forecasting from './components/Forecasting'
import Form from './components/Form'
import {
  bind,
  find,
  propEq,
  divide,
  isEmpty,
  multiply,
  length,
  subtract,
  pick,
  pipe,
  pluck,
  prop,
  props,
  sum,
} from 'ramda'
import mockData from './mocks/historical'
import processData from './functions/data-processor'
import { stringMerge } from './functions/string'

const EXCHANGE_RATE_URL =
  'https://min-api.cryptocompare.com/data/price?fsym={fromCurrency}&tsyms={toCurrency}'

class App extends Component {
  constructor() {
    super()
    this.state = {
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
      projectedProfit: 0,
      projectedProfitPercent: 0,
      historicalData: [], // just balances
    }
    this.handleChange = bind(this.handleChange, this)
  }

  componentDidMount() {
    const { state } = this
    fetch(
      stringMerge(
        EXCHANGE_RATE_URL,
        pick(['fromCurrency', 'toCurrency'], state)
      )
    ).then(exchangeRateData => {
      return exchangeRateData.json().then(json => {
        processData(mockData, {
          oneEthInGbp: json.GBP,
          daysLeft: subtract(
            multiply(365, 2),
            length(state.historicalData)
          ),
          // todo merge
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

  get forecast() {
    const { state } = this
    if (isEmpty(state.historicalData)) {
      return null
    }
    return (
      <Forecasting
        projectedProfit={state.projectedProfit}
        projectedProfitPercent={
          state.projectedProfitPercent
        }
        daysLeft={state.daysLeft}
        oneEthInGbp={state.oneEthInGbp}
        daysLength={length(state.historicalData)}
        historicalData={state.historicalData}
      />
    )
  }

  render() {
    const { state, handleChange } = this
    return (
      <div>
        <Form
          toCurrency={state.toCurrency}
          handleChange={handleChange}
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
            daysLength={state.historicalData.length}
            historicalData={state.historicalData}
            ethGbpData={state.ethGbpData}
          />
          {this.forecast}
        </div>
      </div>
    )
  }
}
export default App
