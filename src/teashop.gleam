import gleam/string
import gleam/io
import teashop/command
import teashop/event
import teashop/duration
import teashop/internal/renderer_options
import gleam/option.{type Option, None, Some}

pub opaque type App(model, msg, flags)

// type AltScreenState {
//   AltScreenEnabled
//   AltScreenDisabled
// }

pub opaque type Options {
  Options(refresh_delay: duration.Duration, alt_screen: renderer_options.AltScreenState)
}

pub fn default_options() {
  Options(refresh_delay: duration.milliseconds(20), alt_screen: renderer_options.AltScreenDisabled)
}

pub fn with_refresh_delay(options: Options, refresh_delay: duration.Duration) {
  Options(..options, refresh_delay: refresh_delay)
}

pub fn with_alt_screen(options: Options) {
  Options(..options, alt_screen: renderer_options.AltScreenEnabled)
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
  options: Options
) -> fn(msg) -> Nil

// pub fn start_with_options(app: App(model, msg, flags), flags: flags, options: Options(msg)) -> StartedApp

