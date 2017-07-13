import React, { Component } from 'react'
import './App.css'
import Statistics from './components/Statistics'
import Forecasting from './components/Forecasting'
import Form from './components/Form'
import {
  find,
  propEq,
  divide,
  multiply,
  subtract,
  pipe,
  pluck,
  sum,
} from 'ramda'
import mockData from './mock-data'
import processData from './DataProcessor'
import { stringMerge } from './string'

const EXCHANGE_RATE_URL =
  'https://min-api.cryptocompare.com/data/price?fsym={fromCurrency}&tsyms={toCurrency}'

class App extends Component {
  constructor() {
    super()
    this.state = {
      sentenceData: [],
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
      historicalData: [],
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { state } = this
    fetch(
      stringMerge(EXCHANGE_RATE_URL, {
        fromCurrency: state.fromCurrency,
        toCurrency: state.toCurrency,
      })
    ).then(exchangeRateData => {
      return exchangeRateData.json().then(json => {
        processData(mockData, {
          oneEthInGbp: json.GBP,
          daysLeft: subtract(
            multiply(365, 2),
            state.sentenceData.length
          ),
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
  get historicalData() {
    return this.state
  }

  get rows() {
    return this.state.sentenceData.map(o => (
      <p className="rows">{o.balance}</p>
    ))
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
            daysLength={state.sentenceData.length}
            historicalData={state.historicalData}
            ethGbpData={state.ethGbpData}
          />
          <Forecasting
            projectedReturn={state.projectedReturn}
            projectedProfitPercent={
              state.projectedProfitPercent
            }
            daysLeft={state.daysLeft}
            oneEthInGbp={state.oneEthInGbp}
            daysLength={state.sentenceData.length}
            historicalData={state.historicalData}
          />
        </div>
      </div>
    )
  }
}
export default App
