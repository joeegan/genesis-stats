import React, { Component } from 'react';
import './App.css';
import mockData from './mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      average: 0,
      averageInGbp: 0,
      oneEthInGbp: 0,
      totalEth: 0,
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
    const data = str.split('\n').map(row => {
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
    this.setState({
      data,
      average,
      totalEth,
    });
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
    const chartData = state.data.slice().reverse()
                                .map((d, i) => ({ name: i, balance: +d.balance }))
                                .map((d, i) => {
                                  if (i == 0 || i == state.data.length-1) {
                                    return {
                                      ...d,
                                      foo: d.balance
                                    }
                                  }
                                  return d;
                                });

    return (
      <div>
        <h1>Genesis (crypto) mining plan forecaster</h1>
        <p>Show stats in: <select><option defaultValue>GBP</option></select></p>
        <p>Copy and paste similar data from your orders page to forecast your returns</p>
        <p><a href='https://www.genesis-mining.com/my-orders'>https://www.genesis-mining.com/my-orders</a></p>
        <textarea cols='90' rows='10' onChange={this.handleChange} value={mockData}></textarea>
        <p>Average payback per day: <strong>{averagePerDayProfitGbp} GBP ({this.state.average.toFixed(4)} ETH) over {state.data.length} days</strong></p>
        <p>Acquisition cost: <input value={contractCostInGbp}></input><select><option selected>GBP</option></select></p>
        <p>Current accrued payback: {accruedPayback} GBP {accruedPaybackAsPercentage}%</p>
        <p>Projected profit if price remains: {projectedReturn.toFixed(2)} GBP ☀️ {projectedProfitPercent.toFixed(2)}% ({daysLeft} days left)</p>
        <sub>Based on {state.oneEthInGbp} ETH/GBP</sub>
        <LineChart width={600} height={400} data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
         <XAxis label="Days" height={100} dataKey="name"/>
         <YAxis label="ETH" orientation='right' width={140} />
         <Tooltip/>
         <Legend content={() => 'ETH mining history per day'} verticalAlign='top' align='left' height={30} />
         <CartesianGrid strokeDasharray="3 3"/>
         <Line type='monotone' dataKey='balance' stroke='#8884d8' />
         <Line type='monotone' connectNulls={true} dataKey='foo' stroke='#4d84d8' />
        </LineChart>
      </div>
    );
  }
}

export default App;
