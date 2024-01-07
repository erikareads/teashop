import teashop/duration

pub opaque type Effect(msg) {
  Effect(fn(fn(msg) -> Nil) -> Nil)
}

pub type Command(msg) {
  Noop
  Quit
  HideCursor
  ShowCursor
  ExitAltScreen
  EnterAltScreen
  Seq(List(Command(msg)))
  SetTimer(msg, duration.Duration)
  Custom(Effect(msg))
}

pub fn from(effect: fn(fn(msg) -> Nil) -> Nil) -> Command(msg) {
  Custom(Effect(fn(dispatch) { effect(dispatch) }))
}
