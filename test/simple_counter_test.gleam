import teashop
import teashop/event
import teashop/key
import teashop/command
import gleam/string

fn init(_) {
  #(0, command.Noop)
}

fn update(model, event) {
  case event {
    event.Key(key.Up) -> #(model + 1, command.Noop)
    event.Key(key.Down) -> #(model - 1, command.Noop)
    _ -> #(model, command.Noop)
  }
}

fn view(model) {
  string.inspect(model)
}

pub fn main() {
  let app = teashop.app(init, update, view)
  teashop.start(app, Nil)
}
