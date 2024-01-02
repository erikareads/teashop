import teashop/key

pub type Event(msg) {
  Frame(Int)
  Key(key.Key)
  Custom(msg)
}
