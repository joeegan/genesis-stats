import React, { Component } from 'react';
import './App.css';
import Chart from './Chart';
import mockData from './mock-data';
import { Line } from 'recharts';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      average: 0,
      averageInGbp: 0,
      oneEthInGbp: 0,
      totalEth: 0,
      ethGbpData: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.processData = this.processData.bind(this);
  }

  componentDidMount() {

    fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP').then(response => {
      return response.json().then(json => {
        this.setState({
          oneEthInGbp: json.GBP,
        });
        this.processData(mockData);
      });
    })

  }

  processData(str) {
    const data = str.split('\n').reverse().map(row => {
      const splitRow = row.split(' ');
      return {
        currency: splitRow[1],
        balance: splitRow[4],
        date: splitRow[10],
      }
    });
    const totalEth = data.map(d => d.balance).reduce((acc, val, i) => {
      return +acc + +val;
    }, 0);
    const average = totalEth / data.length;
    fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=GBP&limit=${data.length}&aggregate=3&e=CCCAGG`).then(response => {
      return response.json().then(json => {
        this.setState({
          data,
          average,
          totalEth,
          ethGbpData: json.Data.map((d, i) => ({
            price: d.open,
            day: i,
          }))
        });
      });
    })
  }

  handleChange(event) {
    this.processData(event.target.value)
  }

  get rows() {
    return this.state.data.map(o => (
      <p className='rows'>{o.balance}</p>
    ))
  }

  render() {
    const { state } = this;
    const contractCostInGbp = 100;
    const averagePerDayProfitGbp = (state.average * state.oneEthInGbp).toFixed(2);
    const accruedPayback = (state.totalEth * state.oneEthInGbp).toFixed(2);
    const accruedPaybackAsPercentage = (contractCostInGbp / 100) * accruedPayback;
    const daysLeft = (365*2 - +state.data.length);
    const projectedReturn = (daysLeft * this.state.average * state.oneEthInGbp) - contractCostInGbp;
    const projectedProfitPercent = (contractCostInGbp / 100) * projectedReturn;
    const historyData = state.data.slice()
                                .map((d, i) => {
                                  const { data } = state;
                                  const slice = data.slice(0, i);
                                  const sumOfPreviousDays = slice.reduce((acc, v) => {
                                    return acc + +v.balance;
                                  }, 0);
                                  return {
                                    day: i + 1,
                                    balance: +d.balance,
                                    gbpValue: +d.balance * +state.ethGbpData.find(j => j.day === i).price,
                                    average: (sumOfPreviousDays / i) || +d.balance,
                                  }
                                });

    let forecastData = [];
    if (historyData.length) {
       forecastData = historyData.concat(
                        new Array(daysLeft - state.data.length)
                              .fill(0)
                              .map((item, i) => ({
                                  day: state.data.length + i,
                                  balance: state.average,
                                  average: state.average,
                                }))
                      )
    }


    return (
      <div>
        <h1>Genesis (crypto) mining plan forecaster</h1>
        <p>Show stats in: <select><option defaultValue>GBP</option></select></p>
        <p>Copy and paste similar data from your orders page to forecast your returns</p>
        <p><a href='https://www.genesis-mining.com/my-orders'>genesis-mining.com/my-orders</a></p>
        <textarea cols='90' rows='10' onChange={this.handleChange} value={mockData}></textarea>
        <hr/>
        <p>Average payback per day: <strong>{averagePerDayProfitGbp} GBP ({this.state.average.toFixed(4)} ETH) over {state.data.length} days</strong></p>
        <p>Acquisition cost: <input readOnly value={contractCostInGbp}></input><select><option defaultValue>GBP</option></select></p>
        <p>Current accrued payback: {accruedPayback} GBP {accruedPaybackAsPercentage}%</p>
        <p>Projected profit if ETH/GBP price remains: {projectedReturn.toFixed(2)} GBP ☀️ {projectedProfitPercent.toFixed(2)}% ({daysLeft} days left)</p>
        <sub>Based on {state.oneEthInGbp} ETH/GBP ({new Date().toISOString().replace(/[A-Z]/g, ' ').substring(0, 19)})</sub>
        <hr/>

        <div className='flex'>

          <Chart
            data={historyData}
            yAxisLabel='ETH'
            legendTitle='ETH mining history per day'
            lines={[
              <Line key='a' type='monotone' dataKey='balance' stroke='#8884d8' />,
              <Line key='b' type='monotone' dataKey='average' stroke='#4d84d8' dot={false} />
            ]}
          />

          <Chart
            data={historyData}
            yAxisLabel='GBP'
            legendTitle='GBP value of ETH mining per day'
            lines={[
              <Line key='a' type='monotone' dataKey='gbpValue' stroke='#4d84d8' dot={false} />
            ]}
          />

          <Chart
            data={this.state.ethGbpData}
            yAxisLabel='GBP'
            legendTitle='ETH/GBP since contract acquired'
            lines={[
              <Line key='a' type='monotone' dataKey='price' stroke='#4d84d8' dot={false} />
            ]}
          />

        </div>

        <Chart
          data={forecastData}
          yAxisLabel='ETH'
          legendTitle='ETH mining forecast'
          lines={[
            <Line key='a' type='monotone' dataKey='average' stroke='#4d84d8' dot={false} />
          ]}
        />

    </div>
    );
  }
}

export default App;
