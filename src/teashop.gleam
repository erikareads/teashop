import gleam/string
import gleam/io
import teashop/command
import teashop/event
import gleam/option.{type Option, None, Some}
@target(erlang)
import gleam/erlang/process.{type Selector, type Subject}

pub opaque type App(model, msg, flags)

pub opaque type StartedApp(model, msg, flags)

@target(javascript)
type Selector(a)

pub opaque type Options(a) {
  Options(refresh_delay: Option(Int), selector: Option(Selector(a)))
}

pub fn default_options() {
  Options(refresh_delay: Some(20), selector: None)
}

pub fn with_refresh_delay(options: Options(a), refresh_delay: Int) {
  Options(..options, refresh_delay: Some(refresh_delay))
}

@target(erlang)
pub fn with_selector(options: Options(a), selector: Selector(a)) {
  Options(..options, selector: Some(selector))
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
) -> StartedApp(model, msg, flags)

// pub fn start_with_options(app: App(model, msg, flags), flags: flags, options: Options(msg)) -> StartedApp

@external(javascript, "./teashop.ffi.mjs", "send")
pub fn send(
  started_application: StartedApp(model, msg, flags),
  message: msg,
) -> Nil
// @target(erlang)
// pub fn app_subject(started_application: StartedApp(model, msg, flags)) -> Subject(msg)
