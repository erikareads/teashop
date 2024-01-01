// Copyright 2023 Im-Beast. MIT license.
import { emitInputEvents } from "./input_reader_mod.ts";

/** Emit input events to Tui  */
export async function handleInput(tui) {
  await emitInputEvents(tui.stdin, tui, tui.refreshRate);
}
