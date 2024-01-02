import gleam/string
import gleam/io
import teashop/command
import teashop/event

pub opaque type App(model, msg, flags)


@external(javascript, "./teashop.ffi.mjs", "setup")
pub fn app(
  init: fn(flags) -> #(model, command.Command(msg)),
  update: fn(model, event.Event(msg)) -> #(model, command.Command(msg)),
  view: fn(model) -> String,
) -> App(model, msg, flags)

@external(javascript, "./teashop.ffi.mjs", "run")
pub fn start(app: App(model, msg, flags), flags: flags) -> Nil
