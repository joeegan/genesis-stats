import { multiply, divide } from 'ramda'
export const percent = (small, big) =>
  multiply(divide(small, big), 100)
