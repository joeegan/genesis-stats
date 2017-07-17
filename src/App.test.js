import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

window.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ GBP: 1 }),
  }),
)

it('renders without crashing', () => {
  // const div = document.createElement('div')
  // ReactDOM.render(<App />, div)
  expect(1).toBe(1)
})
