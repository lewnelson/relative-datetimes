const relativeDateTimes = module.exports = {}

/**
 * Get UTC components of a date object
 *
 * @param {Date} date
 * @returns {Object}
 */
const getDateComponents = date => ({
  year: date.getUTCFullYear(),
  month: date.getUTCMonth(),
  day: date.getUTCDate(),
  dayOfWeek: date.getUTCDay(),
  hours: date.getUTCHours(),
  minutes: date.getUTCMinutes(),
  seconds: date.getUTCSeconds()
})

const addToDate = (date, quantity, unit) => {
  const {
    year,
    month,
    day,
    hours,
    minutes,
    seconds
   } = getDateComponents(date)

  if (unit === 'y') {
    return new Date(Date.UTC(year + quantity, month, day, hours, minutes, seconds))
  } else if (unit === 'M') {
    return new Date(Date.UTC(year, month + quantity, day, hours, minutes, seconds))
  } else if (unit === 'w') {
    return new Date(Date.UTC(year, month, day + (7 * quantity), hours, minutes, seconds))
  } else if (unit === 'd') {
    return new Date(Date.UTC(year, month, day + quantity, hours, minutes, seconds))
  } else if (unit === 'h') {
    return new Date(Date.UTC(year, month, day, hours + quantity, minutes, seconds))
  } else if (unit === 'm') {
    return new Date(Date.UTC(year, month, day, hours, minutes + quantity, seconds))
  } else if (unit === 's') {
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds + quantity))
  }
}

const roundDate = (date, unit) => {
  const {
    year,
    month,
    day,
    dayOfWeek,
    hours,
    minutes
  } = getDateComponents(date)

  let low, high
  if (unit === 'y') {
    low = new Date(Date.UTC(year, 0))
    high = new Date(Date.UTC(year + 1, 0))
  } else if (unit === 'M') {
    low = new Date(Date.UTC(year, month))
    high = new Date(Date.UTC(year, month + 1))
  } else if (unit === 'w') {
    low = new Date(year, month, day - (dayOfWeek))
    high = new Date(year, month, day + (7 - dayOfWeek))
  } else if (unit === 'd') {
    low = new Date(Date.UTC(year, month, day))
    high = new Date(Date.UTC(year, month, day + 1))
  } else if (unit === 'h') {
    low = new Date(Date.UTC(year, month, day, hours))
    high = new Date(Date.UTC(year, month, day, hours + 1))
  } else if (unit === 'm') {
    low = new Date(Date.UTC(year, month, day, hours, minutes))
    high = new Date(Date.UTC(year, month, day, hours, minutes + 1))
  }

  const difference = high.getTime() - low.getTime()
  return date.getTime() - low.getTime() >= difference / 2 ? high : low
}

const getUTCString = (date) => date.toISOString().replace(/\.[\d]{3}Z$/, 'Z')
const toDate = (utcString) => new Date(utcString)

/**
 * Parses relative date string syntax into a UTC date string
 * 
 * @param {String} relativeDate
 * @returns {String} e.g. 2020-04-25T15:04:00Z
 */
relativeDateTimes.parse = (relativeDate) => {
  if (!relativeDate.match(/^now([+-\/].*)?$/)) throw new Error('Invalid format for "relativeDate" in "relativeDateTimes.parse". Must begin with "now"')
  const instructions = relativeDate.match(/([-+]\d+[yMwdhms]|\/[yMwdhms])/g) || []
  const parsedDate = instructions.reduce((date, instruction) => {
    const operator = instruction[0]
    const unit = instruction[instruction.length - 1]
    if (instruction.length > 2) {
      const quantity = parseInt(instruction.slice(1, instruction.length - 1))
      return addToDate(date, operator === '-' ? quantity * -1 : quantity, unit)
    } else {
      return roundDate(date, unit)
    }
  }, new Date())

  return getUTCString(parsedDate)
}

/**
 * Converts a UTC date string to a relative date string
 * 
 * @param {String} datetime e.g. 2020-04-25T15:04:00Z
 * @returns {String} e.g. now/y -> now rounded to the nearest year
 */
relativeDateTimes.stringify = (datetime) => {
  const date = toDate(datetime)
  const now = new Date()
  if (isNaN(date.getTime())) throw new Error('Invalid datetime, must be in UTC format excluding ms e.g. 2020-04-25T15:04:00Z')
  if (datetime === getUTCString(now)) return 'now'
  const {
    year,
    month,
    day,
    dayOfWeek,
    hours,
    minutes,
    seconds
  } = getDateComponents(date)

  const {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
    dayOfWeek: currentDayOfWeek,
    hours: currentHours,
    minutes: currentMinutes,
    seconds: currentSeconds,
  } = getDateComponents(now)

  let rounded
  const isTruthy = (value) => Boolean(value)
  if ([ seconds === 0, minutes === 0, hours === 0, day === 0, month === 0 ].every(isTruthy)) {
    rounded = 'Y'
  } else if ([ seconds === 0, minutes === 0, hours === 0, day === 0 ].every(isTruthy)) {
    rounded = 'M'
  } else if ([ seconds === 0, minutes === 0, hours === 0 ].every(isTruthy)) {
    rounded = 'd'
  } else if ([ seconds === 0, minutes === 0 ].every(isTruthy)) {
    rounded = 'h'
  } else if ([ seconds === 0 ].every(isTruthy)) {
    rounded = 'm'
  }

  if ([ !rounded, dayOfWeek === 0 ].every(isTruthy)) {
    rounded = 'w'
  }

  const diffs = {
    year: year - currentYear,
    month: month - currentMonth,
    day: day - currentDay,
    hours: hours - currentHours,
    minutes: minutes - currentMinutes,
    seconds: seconds - currentSeconds
  }

  let relativeDate = 'now'
  if (diffs.year) relativeDate += `${diffs.year > 0 ? '+' : '-'}${Math.abs(diffs.year)}y`
  if (diffs.month) relativeDate += `${diffs.month > 0 ? '+' : '-'}${Math.abs(diffs.month)}M`
  if (diffs.day) {
    if (diffs.day % 7 === 0) {
      relativeDate += `${diffs.day > 0 ? '+' : '-'}${Math.abs(diffs.day / 7)}w`
    } else {
      relativeDate += `${diffs.day > 0 ? '+' : '-'}${Math.abs(diffs.day)}d`
    }
  }

  if (diffs.hours) relativeDate += `${diffs.hours > 0 ? '+' : '-'}${Math.abs(diffs.hours)}h`
  if (diffs.minutes) relativeDate += `${diffs.minutes > 0 ? '+' : '-'}${Math.abs(diffs.minutes)}m`
  if (diffs.seconds) relativeDate += `${diffs.seconds > 0 ? '+' : '-'}${Math.abs(diffs.seconds)}s`

  if (rounded) relativeDate += `/${rounded}`
  return relativeDate
}
