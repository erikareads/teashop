pub opaque type Effect(msg)

pub type Command(msg) {
  Noop
  HideCursor
  EnterAltScreen
  Seq(List(Command(msg)))
  Quit
  Custom(Effect(msg))
}
