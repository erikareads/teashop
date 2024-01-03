import teashop/key

pub type Event(msg) {
  Frame(Int)
  Key(key.Key)
  Resize(width: Int, height: Int)
  Custom(msg)
}
