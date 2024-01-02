import teashop
import gleam/string
import gleam/io
import gleam/option.{None}
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
        #("Buy empanadas 🥟", Unselected),
        #("Buy carrots 🥕", Unselected),
        #("Buy cupcakes 🧁", Unselected)
        ]
  )

pub fn init(_) {
  #(initial_model, teashop.Noop)
}
// pub fn init(_) { teashop.Seq([teashop.EnterAltScreen, teashop.HideCursor]) }

pub fn update(model: Model, event) {
  case event {
      teashop.KeyEvent(teashop.Char("q")) | teashop.KeyEvent(teashop.Esc) ->
        #(model, teashop.Quit)
      teashop.KeyEvent(teashop.Char("k")) | teashop.KeyEvent(teashop.Up) -> {
        let choices_len = list.length(model.choices)
        let cursor = case model.cursor == 0 {
          True -> choices_len - 1
          False -> model.cursor - 1
        }
        #(Model(..model, cursor: cursor), teashop.Noop)
      }
      teashop.KeyEvent(teashop.Char("j")) | teashop.KeyEvent(teashop.Down) -> {
        let choices_len = list.length(model.choices)
        let cursor = case model.cursor == {choices_len - 1} {
          True -> 0
          False -> model.cursor + 1
        }
        #(Model(..model, cursor: cursor), teashop.Noop)
      }
      teashop.KeyEvent(teashop.Enter) | teashop.KeyEvent(teashop.Space) -> {
        let toggle = fn(status) {
          case status {
            Selected -> Unselected
            Unselected -> Selected
          }
        }
        let choices = list.index_map(model.choices, fn(element, index) {
          let #(name, status) = element
          let status = case index == model.cursor {
            True -> toggle(status)
            False -> status
          }
          #(name, status)
        })
        #(Model(..model, choices: choices), teashop.Noop)
      }
      _otherwise -> #(model, teashop.Noop)
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

  "What should we buy at the market?\n\n" <> options <> "\n\nPress q to quit."
}


pub fn main() {
  let app = teashop.app(init, update, view)
  teashop.start(app, Nil)
}

