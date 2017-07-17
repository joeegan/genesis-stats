import React from 'react'
import {
  add,
  length,
  addIndex,
  map,
  filter,
  pluck,
  prop,
  last,
} from 'ramda'
import { stringMerge } from './string'

it(`Merges object properties into a string`, () => {
  expect(stringMerge('foo{a}{b}', { a: 1, b: 2 })).toEqual(
    'foo12',
  )
  expect(
    stringMerge('{a}bar{b}', { a: 'foo', b: 'baz' }),
  ).toEqual('foobarbaz')
})
