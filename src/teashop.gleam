import gleam/string
import gleam/io

pub opaque type App

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

pub type Event(a) {
  Frame(Int)
  KeyEvent(Key)
}

pub type Command {
  Noop
  HideCursor
  EnterAltScreen
  Seq(List(Command))
  Quit
}

@external(javascript, "./teashop.ffi.mjs", "setup")
pub fn app(
  init: fn(model) -> Command,
  update: fn(model, Event(a)) -> #(model, Command),
  view: fn(model) -> String,
) -> App

@external(javascript, "./teashop.ffi.mjs", "run")
pub fn start(app: App, initial_model: model) -> App
