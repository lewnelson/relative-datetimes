# Relative Datetimes

A JavaScript library to parse and transform strings into datetimes relative to now.

## Usage

### Parse

```JavaScript
relativeDateTimes.parse('now/y') // -> now rounded to the nearest year
```

Parse accepts a single argument (relativeDate: <String>). The format begins with "now" followed by a number of operators to manipulate the datetime output. The instructions are parsed left to right.

The following operators are available:

* `-` subtract
* `+` add
* `/{unit}` round to the closest unit

The following units are available:

* `y` year (365 days)
* `M` month
* `w` week, weeks begin on a Sunday
* `d` day
* `h` hour
* `m` minute
* `s` second

The format is parsed left to right.

## TODO

* Complete `.stringify` implementation and tests.
