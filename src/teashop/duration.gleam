pub opaque type Duration {
  Duration(milliseconds: Int)
}

const seconds_to_milliseconds = 1000
const minutes_to_milliseconds = 60_000
const hours_to_milliseconds = 3_600_000

pub fn milliseconds(n: Int) -> Duration {
  Duration(n)
}

pub fn seconds(n: Int) -> Duration {
  Duration(n * seconds_to_milliseconds)
}

pub fn minutes(n: Int) -> Duration {
  Duration(n * minutes_to_milliseconds)
}

pub fn hours(n: Int) -> Duration {
  Duration(n * hours_to_milliseconds)
}

pub fn add(a: Duration, b: Duration) -> Duration {
  Duration(a.milliseconds + b.milliseconds)
}

pub fn to_milliseconds(a: Duration) -> Int {
  a.milliseconds
}
