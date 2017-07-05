import React, { Component } from 'react';
import './App.css';
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
  }

  componentDidMount() {

    fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP').then(response => {
      return response.json().then(json => {
        this.setState({
          oneEthInGbp: json.GBP,
        });
      });
    })

  }

  handleChange(event) {
    const data = event.target.value.split('\n').map(row => {
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
    const daysLeft = (365*2 - +state.data.length);
    const projectedReturn = (daysLeft * this.state.average * state.oneEthInGbp) - contractCostInGbp;
    const projectedProfitPercent = (contractCostInGbp / 100) * projectedReturn;
    const chartData = state.data.slice().reverse()
                                .map((d, i) => ({ name: 'day '+ i, value: +d.balance }))

    return (
      <div>
        <textarea cols='100' rows='30' onChange={this.handleChange}></textarea>
        <p>Average payback per day: £{averagePerDayProfitGbp} ({this.state.average.toFixed(4)} ETH) over {state.data.length} days </p>
        <p>Purchase: £{contractCostInGbp}</p>
        <p>Current accrued payback: £{accruedPayback}</p>
        <p>Projected profit if price remains: £{projectedReturn.toFixed(2)} {projectedProfitPercent.toFixed(2)}% ({daysLeft} days left)</p>
        <sub>Based on ETH/GBP {state.oneEthInGbp}</sub>
        <LineChart width={400} height={400} data={chartData}>
         <XAxis dataKey="name"/>
         <YAxis/>
         <Tooltip/>
         <Legend />
         <CartesianGrid strokeDasharray="3 3"/>
          <Line type='monotone' dataKey='value' stroke='#8884d8' />
        </LineChart>
      </div>
    );
  }
}

export default App;
