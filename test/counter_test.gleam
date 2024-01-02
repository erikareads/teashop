// import teashop
// import gleam/io
// import gleam/string

// pub fn main() {
//   let init = fn(_) { teashop.Seq([teashop.HideCursor]) }
//   let update = fn(x, event) {
//     case event {
//       // x if x >= 100 -> #(x, teashop.Quit)
//       teashop.Frame(_) -> #(x + 1, teashop.Noop)
//       teashop.KeyEvent(teashop.Down) -> #(x - 50, teashop.Noop)
//       _otherwise -> {
//       io.debug(event)
//       // io.println("hi")
//       #(x + 1, teashop.Noop)
//       }
//     }
//   }
//   let view = fn(x) { string.inspect(x) }
//   let app = teashop.app(init, update, view)
//   teashop.start(app, 1)
// }
