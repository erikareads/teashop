import teashop
import teashop/event
import teashop/command
import teashop/key
import gleam/string
import gleam/list

pub type Status {
  Selected
  Unselected
}

pub type Model {
  Model(choices: List(#(String, Status)), cursor: Int)
}

const initial_model = Model(
  cursor: 0,
  choices: [
    #("Kitten cuddles 🐈", Unselected),
    #("Strawberry shortcake 🍰", Unselected),
    #("Blueberry muffins 🫐", Unselected),
  ],
)

pub fn init(_) {
  #(initial_model, command.set_window_title("teashop"))
}

pub fn update(model: Model, event) {
  case event {
    event.Key(key.Char("q")) | event.Key(key.Esc) -> #(model, command.quit())

    event.Key(key.Char("k")) | event.Key(key.Up) -> {
      let choices_len = list.length(model.choices)
      let cursor = case model.cursor == 0 {
        True -> choices_len - 1
        False -> model.cursor - 1
      }
      #(Model(..model, cursor: cursor), command.noop())
    }

    event.Key(key.Char("j")) | event.Key(key.Down) -> {
      let choices_len = list.length(model.choices)
      let cursor = case model.cursor == { choices_len - 1 } {
        True -> 0
        False -> model.cursor + 1
      }
      #(Model(..model, cursor: cursor), command.noop())
    }

    event.Key(key.Enter) | event.Key(key.Space) -> {
      let toggle = fn(status) {
        case status {
          Selected -> Unselected
          Unselected -> Selected
        }
      }
      let choices =
        list.index_map(model.choices, fn(element, index) {
          let #(name, status) = element
          let status = case index == model.cursor {
            True -> toggle(status)
            False -> status
          }
          #(name, status)
        })
      #(Model(..model, choices: choices), command.noop())
    }
    _otherwise -> #(model, command.noop())
  }
}

pub fn view(model: Model) {
  let options =
    model.choices
    |> list.index_map(fn(element, index) {
      let #(name, status) = element
      let cursor = case model.cursor == index {
        True -> ">"
        False -> " "
      }
      let checked = case status {
        Selected -> "x"
        _ -> " "
      }
      cursor <> " [" <> checked <> "] " <> name
    })
    |> string.join("\n")

  let header = "What should we get at the tea shop?"
  let footer = "Press q to quit."

  [header, options, footer]
  |> string.join("\n\n")
}

pub fn main() {
  let app = teashop.app(init, update, view)
  teashop.start(app, Nil)
}
