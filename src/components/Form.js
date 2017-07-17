import React from 'react'
import mockData from '../mocks/historical'

const Form = ({
  analysisCurrencyCode,
  handleChange,
  contractCostInGbp,
}) => {
  return (
    <div className="input">
      <p>
        Show stats in:
        {' '}
        <select>
          <option defaultValue>
            {analysisCurrencyCode}
          </option>
        </select>
      </p>
      <p>
        Paste in your orders data from
        {' '}
        <a href="https://www.genesis-mining.com/my-orders">
          genesis-mining.com/my-orders
        </a>:
      </p>
      <textarea
        cols="120"
        rows="5"
        onChange={handleChange}
        value={mockData}
      />
      <p>
        How much did your contract cost?
        {' '}
        <input readOnly value={contractCostInGbp} />
        <select>
          <option defaultValue>GBP</option>
        </select>
      </p>
      <p>
        When does your contract end?
        {' '}
        <input type="date" readOnly value="2019-06-16" />
      </p>
    </div>
  )
}

export default Form
