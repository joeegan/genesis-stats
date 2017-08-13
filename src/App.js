import React, { Component } from 'react'
import {
  bind,
  isEmpty,
  length,
  head,
  values,
  view,
  lensIndex,
  split,
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
      exchangeRate: 0,
      totalCrypto: 0,
      pricesWithDays: [],
      analysisCurrencyCode: 'GBP',
      contractCostInAnalysisCurrency: 100,
      contractLengthInDays: 365 * 2,
      averagePerDayProfitInAnalysisCurrency: 0,
      accruedPayback: 0,
      accruedPaybackAsPercentage: 0,
      daysLeft: 0,
      projectedProfit: 0,
      projectedProfitPercent: 0,
      historicalData: [],
    }
    this.handlePastedDataChange = bind(
      this.handlePastedDataChange,
      this,
    )
    this.handleContractEndDate = bind(
      this.handleContractEndDate,
      this,
    )
    this.handleContractCostChange = bind(
      this.handleContractCostChange,
      this,
    )
    this.handleAnalysisCurrencyChange = bind(
      this.handleAnalysisCurrencyChange,
      this,
    )
  }

  componentWillMount() {
    const {
      state: {
        analysisCurrencyCode,
        contractCostInAnalysisCurrency,
        contractLengthInDays,
      },
    } = this
    const minedCurrencyCode = view(
      lensIndex(1),
      split(' ', head(split('\n', mockData))),
    )
    fetch(
      stringMerge(EXCHANGE_RATE_URL, {
        minedCurrencyCode,
        analysisCurrencyCode,
      }),
    ).then(exchangeRateData => {
      return exchangeRateData
        .json()
        .then(exchangeRateData => {
          return processData(mockData, {
            contractLengthInDays,
            exchangeRate: head(values(exchangeRateData)),
            contractCostInAnalysisCurrency,
            minedCurrencyCode,
            analysisCurrencyCode,
          }).then(data =>
            this.setState({
              ...data,
              minedCurrencyCode,
            }),
          )
        })
    })
  }

  handleContractCostChange() {
    // TODO
  }

  handleContractEndDate() {
    // TODO
  }

  handleAnalysisCurrencyChange() {
    // TODO
  }

  handlePastedDataChange({ target: { value } }) {
    processData(value).then(data => this.setState(data))
  }

  get forecast() {
    const { state } = this
    if (isEmpty(state.historicalData)) {
      return null
    }
    return (
      <Forecasting
        analysisCurrencyCode={state.analysisCurrencyCode}
        minedCurrencyCode={state.minedCurrencyCode}
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
    const {
      state,
      handleAnalysisCurrencyChange,
      handleContractEndDate,
      handleContractCostChange,
      handlePastedDataChange,
    } = this
    return (
      <div>
        <Form
          analysisCurrencyCode={state.analysisCurrencyCode}
          handlePastedDataChange={handlePastedDataChange}
          handleAnalysisCurrencyChange={
            handleAnalysisCurrencyChange
          }
          handleContractCostChange={
            handleContractCostChange
          }
          handleContractEndDate={handleContractEndDate}
          contractCostInAnalysisCurrency={
            state.contractCostInAnalysisCurrency
          }
        />
        <div className="output">
          <Statistics
            analysisCurrencyCode={
              state.analysisCurrencyCode
            }
            minedCurrencyCode={state.minedCurrencyCode}
            accruedPayback={state.accruedPayback}
            accruedPaybackAsPercentage={
              state.accruedPaybackAsPercentage
            }
            averagePerDayProfitInAnalysisCurrency={
              state.averagePerDayProfitInAnalysisCurrency
            }
            average={state.average}
            daysLength={length(state.historicalData)}
            historicalData={state.historicalData}
            pricesWithDays={state.pricesWithDays}
          />
          {this.forecast}
        </div>
      </div>
    )
  }
}
export default App
