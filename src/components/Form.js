import React from 'react'
import mockData from '../mocks/historical'

const Form = ({
  analysisCurrencyCode,
  contractCostInAnalysisCurrency,
  handleAnalysisCurrencyChange,
  handlePastedDataChange,
  handleContractCostChange,
  handleContractEndDate,
}) => {
  return (
    <div className="input">
      <p>
        Show stats in:{' '}
        <select onChange={handleAnalysisCurrencyChange}>
          <option defaultValue>
            {analysisCurrencyCode}
          </option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </p>
      <p>
        Paste in your orders data from{' '}
        <a href="https://www.genesis-mining.com/my-orders">
          genesis-mining.com/my-orders
        </a>:
      </p>
      <textarea
        cols="120"
        rows="5"
        onChange={handlePastedDataChange}
        value={mockData}
      />
      <p>
        How much did your contract cost?{' '}
        <input
          type="text"
          value={contractCostInAnalysisCurrency}
          onChange={handleContractCostChange}
        />
        {analysisCurrencyCode}
      </p>
      <p>
        When does your contract end?{' '}
        <input
          onChange={handleContractEndDate}
          type="date"
          value="2019-06-16"
        />
      </p>
    </div>
  )
}

export default Form
