import React, { Component } from 'react'
import {
  bind,
  isEmpty,
  length,
  subtract,
  head,
  values,
} from 'ramda'

import './App.css'

import Statistics from './components/Statistics'
import Forecasting from './components/Forecasting'
import Form from './components/Form'

import mockData from './mocks/historical'
import processData from './functions/data-processor'
import { stringMerge } from './functions/string'

const EXCHANGE_RATE_URL =
  'https://min-api.cryptocompare.com/data/price?fsym={minedCurrencyCode}&tsyms={analysisCurrencyCode}'

class App extends Component {
  constructor() {
    super()
    this.state = {
      average: 0,
      averageInGbp: 0,
      exchangeRate: 0,
      totalEth: 0,
      ethGbpData: [],
      minedCurrencyCode: 'ETH',
      analysisCurrencyCode: 'GBP',
      contractCostInGbp: 100,
      contractLengthInDays: 365 * 2,
      averagePerDayProfitGbp: 0,
      accruedPayback: 0,
      accruedPaybackAsPercentage: 0,
      daysLeft: 0,
      projectedProfit: 0,
      projectedProfitPercent: 0,
      historicalData: [],
    }
    this.handleChange = bind(this.handleChange, this)
  }

  componentWillMount() {
    const {
      state: {
        analysisCurrencyCode,
        contractCostInGbp,
        contractLengthInDays,
        historicalData,
        minedCurrencyCode,
      },
    } = this
    fetch(
      stringMerge(
        EXCHANGE_RATE_URL,
        minedCurrencyCode,
        analysisCurrencyCode,
      ),
    ).then(exchangeRateData =>
      exchangeRateData.json().then(exchangeRateData =>
        processData(mockData, {
          daysLeft: subtract(
            contractLengthInDays,
            length(historicalData),
          ),
          exchangeRateData: head(values(exchangeRateData)),
          contractCostInGbp,
          minedCurrencyCode,
          analysisCurrencyCode,
        }).then(data => this.setState(data)),
      ),
    )
  }

  handleChange({ target: { value } }) {
    processData(value).then(data => this.setState(data))
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
        exchangeRate={state.exchangeRate}
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
          analysisCurrencyCode={state.analysisCurrencyCode}
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
