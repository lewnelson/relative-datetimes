const relativeDatetimes = require('./index')
const MockDate = require('mockdate')

describe('relative datetimes library', () => {
  beforeEach(() => {
    MockDate.set(new Date('2020-04-15T10:08:35Z'))
  })

  describe('parse', () => {
    test('now returns "2020-04-15T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now')).toEqual('2020-04-15T10:08:35Z')
    })

    test('now/y returns "2020-01-01T00:00:00Z"', () => {
      expect(relativeDatetimes.parse('now/y')).toEqual('2020-01-01T00:00:00Z')
    })

    test('now/M returns "2020-04-01T00:00:00Z"', () => {
      expect(relativeDatetimes.parse('now/M')).toEqual('2020-04-01T00:00:00Z')
    })

    test('now/w returns "2020-04-12T00:00:00Z"', () => {
      expect(relativeDatetimes.parse('now/w')).toEqual('2020-04-12T00:00:00Z')
    })

    test('now/d returns "2020-04-15T00:00:00Z"', () => {
      expect(relativeDatetimes.parse('now/d')).toEqual('2020-04-15T00:00:00Z')
    })

    test('now/h returns "2020-04-15T10:00:00Z"', () => {
      expect(relativeDatetimes.parse('now/h')).toEqual('2020-04-15T10:00:00Z')
    })

    test('now/m returns "2020-04-15T10:09:00Z"', () => {
      expect(relativeDatetimes.parse('now/m')).toEqual('2020-04-15T10:09:00Z')
    })

    test('now+1y returns "2021-04-15T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now+1y')).toEqual('2021-04-15T10:08:35Z')
    })

    test('now-3y returns "2017-04-15T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now-3y')).toEqual('2017-04-15T10:08:35Z')
    })

    test('now+5M returns "2020-09-15T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now+5M')).toEqual('2020-09-15T10:08:35Z')
    })

    test('now-25M returns "2018-03-15T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now-25M')).toEqual('2018-03-15T10:08:35Z')
    })

    test('now+2w returns "2020-04-29T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now+2w')).toEqual('2020-04-29T10:08:35Z')
    })

    test('now-6w returns "2020-03-04T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now-6w')).toEqual('2020-03-04T10:08:35Z')
    })

    test('now+2d returns "2020-04-17T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now+2d')).toEqual('2020-04-17T10:08:35Z')
    })

    test('now-10d returns "2020-04-05T10:08:35Z"', () => {
      expect(relativeDatetimes.parse('now-10d')).toEqual('2020-04-05T10:08:35Z')
    })

    test('now+23h returns "2020-04-16T09:08:35Z"', () => {
      expect(relativeDatetimes.parse('now+23h')).toEqual('2020-04-16T09:08:35Z')
    })

    test('now-4h returns "2020-04-15T06:08:35Z"', () => {
      expect(relativeDatetimes.parse('now-4h')).toEqual('2020-04-15T06:08:35Z')
    })

    test('now+50m returns "2020-04-15T10:58:35Z"', () => {
      expect(relativeDatetimes.parse('now+50m')).toEqual('2020-04-15T10:58:35Z')
    })

    test('now-10m returns "2020-04-15T09:58:35Z"', () => {
      expect(relativeDatetimes.parse('now-10m')).toEqual('2020-04-15T09:58:35Z')
    })

    test('now+5s returns "2020-04-15T10:08:40Z"', () => {
      expect(relativeDatetimes.parse('now+5s')).toEqual('2020-04-15T10:08:40Z')
    })

    test('now-3s returns "2020-04-15T10:08:32Z"', () => {
      expect(relativeDatetimes.parse('now-3s')).toEqual('2020-04-15T10:08:32Z')
    })

    test('now-4y-6M+4d-2h+20m+1w/m returns "2015-10-26T08:29:00Z"', () => {
      expect(relativeDatetimes.parse('now-4y-6M+4d-2h+20m+1w/m')).toEqual('2015-10-26T08:29:00Z')
    })

    test('now-4y-6M+4d-2h+20m+1w/m-5s+4y/M+10d-4m returns "2019-11-10T23:56:00Z"', () => {
      expect(relativeDatetimes.parse('now-4y-6M+4d-2h+20m+1w/m-5s+4y/M+10d-4m')).toEqual('2019-11-10T23:56:00Z')
    })
  })
  
  describe('stringify', () => {
    test('"2020-04-15T10:08:35Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:08:35Z')).toEqual('now')
    })

    test('"2020-04-15T10:08:30Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:08:30Z')).toEqual('now-5s')
    })

    test('"2020-04-15T10:14:30Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:14:30Z')).toEqual('now+6m-5s')
    })

    test('"2020-04-15T10:14:00Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:14:00Z')).toEqual('now+6m/m')
    })

    test('"2020-04-15T10:00:00Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:14:00Z')).toEqual('now/h')
    })

    test('"2020-04-15T5:00:00Z" returns now', () => {
      expect(relativeDatetimes.stringify('2020-04-15T10:14:00Z')).toEqual('now-5h/h')
    })
  })
})
