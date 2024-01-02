pub opaque type Effect(msg) {
  Effect(fn(fn(msg) -> Nil) -> Nil)
}

pub type Command(msg) {
  Noop
  HideCursor
  EnterAltScreen
  Seq(List(Command(msg)))
  Quit
  Custom(Effect(msg))
}

pub fn from(effect: fn(fn(msg) -> Nil) -> Nil) -> Command(msg) {
  Custom(Effect(fn(dispatch) { effect(dispatch) }))
}
