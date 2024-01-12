pub type InternalAction(msg) {
  Shutdown
  Send(msg)
  WindowTitle(String)
  ReleaseTerminal
  RestoreTerminal
}
