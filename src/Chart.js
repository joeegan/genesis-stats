import React, { Component } from 'react';
import './App.css';
import mockData from './mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class App extends Component {

  constructor() {
    super();
  }

  render() {
    const { props } = this;
    return (
      <LineChart width={550} height={400} data={props.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
       <XAxis label={props.xAxisLabel || 'Days'} height={100} dataKey={props.xDataKey || 'day'}/>
       <YAxis label={props.yAxisLabel} orientation='left' width={140} />
       <Tooltip/>
       <Legend content={() => props.legendTitle} verticalAlign='top' align='center' height={30} />
       <CartesianGrid strokeDasharray='3 3'/>
       {props.lines}
      </LineChart>
    )
  }

}
