import teashop

@external(javascript, "../teashop.ffi.mjs", "set_refresh_delay")
pub fn refresh_delay(app: teashop.App(model, msg, flags), refresh_delay: Int) -> teashop.App(model, msg, flags)

@external(javascript, "../teashop.ffi.mjs", "set_alt_screen")
pub fn with_alt_screen(app: teashop.App(model, msg, flags)) -> teashop.App(model, msg, flags)
