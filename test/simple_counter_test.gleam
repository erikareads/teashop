import teashop
import teashop/event
import teashop/key
import teashop/command
import gleam/string

fn init(_) {
  0
}

fn update(model, event: event.Event(Nil)) {
  case event {
    event.Key(key.Up) -> model + 1
    event.Key(key.Down) -> model - 1
    _ -> model
  }
}

fn view(model) {
  string.inspect(model)
}

pub fn main() {
  let app = teashop.simple(init, update, view)
  teashop.start(app, Nil)
}
