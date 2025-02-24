import * as sut from './date-helpers'

describe('DataHelpers', () => {
  test('should return a iso date from alpha vantage date format', () => {
    const date = '2021-06-11 19:26:00'
    const isoDate = sut.alphaVantageDateToIsoDate(date)
    expect(isoDate).toBeTruthy()
  })

  test('should return a iso date from alpha vantage date format', () => {
    const date = '2021-06-11'
    const isoDate = sut.alphaVantageDateToIsoDate(date)
    expect(isoDate).toBeTruthy()
  })
})
