import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      average: 0,
      averageInGbp: 0,
      oneBtcInGbp: 0,
      oneEthInGbp: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

    // Stream BTC/GBP exchange rate for conversion usage
    var socket = io.connect('https://streamer.cryptocompare.com/');
    socket.emit('SubAdd', { subs: ['5~CCCAGG~ETH~BTC'] });
    socket.on('m', message => {
      const msg = message.split('~');
      const responseTicker = `${msg[2]}~${msg[3]}`;
      const price = msg[5];
      const subscriptionId = msg[0];
      if (price && subscriptionId === '5' && responseTicker === 'BTC~GBP') {
        this.setState({
          oneBtcInGbp: price,
        });
      }
      if (price && subscriptionId === '5' && responseTicker === 'ETH~BTC') {
        this.setState({
          oneEthInBtc: price,
        });
      }
    });

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
    const average = data.map(d => d.balance).reduce((acc, val, i) => {
      return +acc + +val;
    }, 0) / data.length;
    this.setState({
      data,
      average,
    });
  }

  get rows() {
    return this.state.data.map(o => (
      <p className='rows'>{o.balance}</p>
    ))
  }

  render() {
    return (
      <div>
        <textarea cols='100' rows='30' onChange={this.handleChange}></textarea>
        <p>Average: {this.state.average} ETH over {this.state.data.length} days</p>
        <p>Purchase of £100</p>
        <p>Clawed back {this.state.averageInGbp}</p>
        <p>1 BTC in GBP  = {+this.state.oneBtcInGbp} (should be around 2000)</p>
        <p>1 ETH in BTC  = {+this.state.oneEthInBtc} (should be around 0.104)</p>
        <p>1 ETH in GBP = ?</p>
      </div>
    );
  }
}

export default App;
