import gleam/string
import gleam/io
import teashop/command
import teashop/event
import teashop/duration
import gleam/option.{type Option, None, Some}

pub opaque type App(model, msg, flags)

pub opaque type Options {
  Options(refresh_delay: Option(duration.Duration))
}

pub fn default_options() {
  Options(refresh_delay: Some(duration.milliseconds(20)), selector: None)
}

pub fn with_refresh_delay(options: Options(a), refresh_delay: duration.Duration) {
  Options(..options, refresh_delay: Some(refresh_delay))
}

@external(javascript, "./teashop.ffi.mjs", "setup")
pub fn app(
  init: fn(flags) -> #(model, command.Command(msg)),
  update: fn(model, event.Event(msg)) -> #(model, command.Command(msg)),
  view: fn(model) -> String,
) -> App(model, msg, flags)

@external(javascript, "./teashop.ffi.mjs", "run")
pub fn start(
  app: App(model, msg, flags),
  flags: flags,
) -> fn(msg) -> Nil

// pub fn start_with_options(app: App(model, msg, flags), flags: flags, options: Options(msg)) -> StartedApp

