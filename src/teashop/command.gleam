import teashop/duration

pub type InternalCommand(msg) {
  Noop
  Quit
  HideCursor
  ShowCursor
  ExitAltScreen
  EnterAltScreen
  ClearScreen
  SetWindowTitle(String)
  Seq(List(Command(msg)))
  SetTimer(msg, duration.Duration)
  ExecuteProcess(String, List(String))
  Custom(fn(fn(msg) -> Nil) -> Nil)
}

pub opaque type Command(msg) {
  Command(InternalCommand(msg))
}

pub fn from(effect: fn(fn(msg) -> Nil) -> Nil) -> Command(msg) {
  Command(Custom(fn(dispatch) { effect(dispatch) }))
}

pub fn none() {
  Command(Noop)
}

pub fn quit() {
  Command(Quit)
}

pub fn hide_cursor() {
  Command(HideCursor)
}

pub fn show_cursor() {
  Command(ShowCursor)
}

pub fn enter_alt_screen() {
  Command(EnterAltScreen)
}

pub fn exit_alt_screen() {
  Command(ExitAltScreen)
}

pub fn set_timer(msg: msg, duration: duration.Duration) -> Command(msg) {
  Command(SetTimer(msg, duration))
}

pub fn sequence(list: List(Command(msg))) -> Command(msg) {
  Command(Seq(list))
}

pub fn set_window_title(title: String) -> Command(msg) {
  Command(SetWindowTitle(title))
}

pub fn clear_screen() {
  Command(ClearScreen)
}

pub fn execute_process(program, args) {
  Command(ExecuteProcess(program, args))
}
