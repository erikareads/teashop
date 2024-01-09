import teashop/duration
import teashop/internal/internal_command.{type Command as InternalCommand}


pub opaque type Command(msg) {
  Command(InternalCommand(msg))
}

pub fn from(effect: fn(fn(msg) -> Nil) -> Nil) -> Command(msg) {
  Command(internal_command.Custom(fn(dispatch) { effect(dispatch) }))
}

pub fn noop() {
  Command(internal_command.Noop)
}

pub fn quit() {
  Command(internal_command.Quit)
}
