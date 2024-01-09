import teashop/duration
pub type Command(msg) {
  Noop
  Quit
  HideCursor
  ShowCursor
  ExitAltScreen
  EnterAltScreen
  Seq(List(Command(msg)))
  SetTimer(msg, duration.Duration)
  Custom(fn(fn(msg) -> Nil) -> Nil)
}
