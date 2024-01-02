import gleam/string
import gleam/io

pub opaque type App(model, msg, flags)

pub type Key {
  Backspace
  Left
  Right
  Up
  Down
  Home
  End
  PageUp
  PageDown
  Tab
  Delete
  Insert
  Enter
  Space
  FKey(Int)
  Char(String)
  Alt(Key)
  Ctrl(Key)
  Shift(Key)
  Esc
  Unknown
}

pub type Event(msg) {
  Frame(Int)
  KeyEvent(Key)
  CustomEvent(msg)
}

pub opaque type Effect(msg)

pub type Command(msg) {
  Noop
  HideCursor
  EnterAltScreen
  Seq(List(Command(msg)))
  Quit
  CustomCommand(Effect(msg))
}

@external(javascript, "./teashop.ffi.mjs", "setup")
pub fn app(
  init: fn(flags) -> #(model, Command(msg)),
  update: fn(model, Event(msg)) -> #(model, Command(msg)),
  view: fn(model) -> String,
) -> App(model, msg, flags)

@external(javascript, "./teashop.ffi.mjs", "run")
pub fn start(app: App(model, msg, flags), flags: flags) -> Nil
