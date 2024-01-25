import teashop/key

pub type Event(msg) {
  Key(key.Key)
  Resize(width: Int, height: Int)
  Custom(msg)
}
