import * as child_process from "node:child_process";
import {

  Shutdown,
  Send,
  WindowTitle,
  ReleaseTerminal,
  RestoreTerminal,
} from "./teashop/internal/action.mjs";

import {
  // Frame,
  Key as KeyEvent,
  Custom as CustomEvent,
  Resize,
} from "./teashop/event.mjs";

import {
  AltScreenEnabled,
  AltScreenDisabled,
} from "./teashop/internal/renderer_options.mjs";

import {
  Quit,
  Noop,
  HideCursor,
  ShowCursor,
  EnterAltScreen,
  ExitAltScreen,
  ClearScreen,
  SetWindowTitle,
  Seq,
  ExecuteProcess,
  SetTimer,
  Custom as CustomCommand,
} from "./teashop/command.mjs";

import {
  Backspace,
  Left,
  Right,
  Up,
  Down,
  Home,
  End,
  PageUp,
  PageDown,
  Tab,
  Space,
  Delete,
  Insert,
  Enter,
  FKey,
  Char,
  Alt,
  Ctrl,
  Shift,
  Esc,
  Unknown,
} from "./teashop/key.mjs";

import process from "node:process";

const get_key_name = (key) => {
  return key.key;
  if (globalThis.Deno) {
    return key.key;
  } else {
    return key.name;
  }
};

const parse_key_type = (key) => {
  let name = get_key_name(key);
  switch (name) {
    case "backspace":
      return new Backspace();
      break;
    case "left":
      return new Left();
      break;
    case "right":
      return new Right();
      break;
    case "up":
      return new Up();
      break;
    case "down":
      return new Down();
      break;
    case "home":
      return new Home();
      break;
    case "end":
      return new End();
      break;
    case "pageup":
      return new PageUp();
      break;
    case "pagedown":
      return new PageDown();
      break;
    case "f1":
      return new FKey(1);
      break;
    case "f2":
      return new FKey(2);
      break;
    case "f3":
      return new FKey(3);
      break;
    case "f4":
      return new FKey(4);
      break;
    case "f5":
      return new FKey(5);
      break;
    case "f6":
      return new FKey(6);
      break;
    case "f7":
      return new FKey(7);
      break;
    case "f8":
      return new FKey(8);
      break;
    case "f9":
      return new FKey(9);
      break;
    case "f10":
      return new FKey(10);
      break;
    case "f11":
      return new FKey(11);
      break;
    case "f12":
      return new FKey(12);
      break;
    case "tab":
      return new Tab();
      break;
    case "delete":
      return new Delete();
      break;
    case "insert":
      return new Insert();
      break;
    case "escape":
      return new Esc();
      break;
    case "return":
      return new Enter();
      break;
    case "enter":
      return new Enter();
      break;
    case "space":
      return new Space();
      break;
    default:
      return new Char(name);
      break;
  }
};

const handle_modifier = (key, parsed_key) => {
  if (key.meta) {
    return new Alt(parsed_key);
  } else if (key.ctrl) {
    return new Ctrl(parsed_key);
  } else if (key.shift) {
    if (parsed_key instanceof Char) {
      return parsed_key;
    } else {
      return new Shift(parsed_key);
    }
  } else {
    return parsed_key;
  }
};

// EventEmitter implementation modified from `deno_tui`:
// Copyright 2023 Im-Beast. MIT license.

/** Custom implementation of event emitter */
class EventEmitter {
  listeners = {};

  on(type, listener, once) {
    let listeners = this.listeners[type];
    if (!listeners) {
      listeners = [];
      this.listeners[type] = listeners;
    }

    if (once) {
      const originalListener = listener;
      listener = (...args) => {
        originalListener.apply(this, args);
        this.off(type, listener);
      };
    }

    if (listeners.includes(listener)) return () => this.off(type, listener);
    listeners.splice(listeners.length, 0, listener);
    return () => this.off(type, listener);
  }

  off(type, listener) {
    if (!type) {
      this.listeners = {};
      return;
    }

    if (!listener) {
      this.listeners[type] = [];
      return;
    }

    const listeners = this.listeners[type];
    if (!listeners) return;
    listeners.splice(listeners.indexOf(listener), 1);
  }

  emit(type, ...args) {
    const listeners = this.listeners[type];
    if (!listeners?.length) return;

    for (const listener of listeners) {
      listener.apply(this, args);
    }
  }
}
// const handleKeyboardInput = (tui) => {
//   if (globalThis.Deno) {
//     import("./input.ts").then((mod) => {
//       tui.stdin = Deno.stdin;

//       mod.handleInput(tui);
//     });
//   } else {
//     import("./keypress.mjs").then((mod) => {
//       mod.keypress(process.stdin);

//       // listen for the "keypress" event
//       process.stdin.on("keypress", function (ch, key) {
//         // console.log('got "keypress"', key);

//         tui.emit("keyPress", key);
//         if (key && key.ctrl && key.name == "c") {
//           tui.emit("destroy");
//         }
//       });

//       process.stdin.setRawMode(true);
//       process.stdin.resume();
//     });
//   }
// };

import { decodeKey } from "./input_reader_decoders_keyboard.mjs";
import { StringDecoder } from "node:string_decoder";

let decoder = new StringDecoder("utf8");

export function* decodeBuffer(buffer) {
  const code = decoder.write(buffer);
  const lastIndex = code.lastIndexOf("\x1b");

  if (code.indexOf("\x1b") !== lastIndex) {
    yield* decodeBuffer(buffer.subarray(0, lastIndex));
    yield* decodeBuffer(buffer.subarray(lastIndex));
  } else {
    // yield decodeMouseVT_UTF8(buffer, code) ??
    // decodeMouseSGR(buffer, code) ??
    yield decodeKey(buffer, code);
  }
}

const denoReader = (() => {
  if (globalThis.Deno) {
    return Deno.stdin.readable.getReader();
  }
})();

const handleBuffer = (tui, buffer) => {
  for (const event of decodeBuffer(buffer)) {
    // if (event.key === "mouse") {
    //   emitter.emit("mouseEvent", event);

    //   if ("button" in event) {
    //     emitter.emit("mousePress", event);
    //   } else if ("scroll" in event) {
    //     emitter.emit("mouseScroll", event);
    //   }
    // } else {
    tui.emit("keyPress", event);
    // console.log(event);
    if (event && event.ctrl && event.key == "c") {
      tui.emit("destroy");
    }
    // }
  }
};

function handleKeyInputDeno(tui) {
  const listener = new DenoListener();
  listener.tui = tui;
  listener.run();
  return listener;
}

class DenoListener extends EventEmitter {
  // make into enum?
  state = "reading";
  tui;

  onCancel() {
    // make into enum?
    this.state = "cancel";
    this.off("cancel", this.onCancel);
  }

  run() {
    this.on("cancel", this.onCancel);
    this.start();
  }
  async start() {
    let buffer = new Uint8Array(0);
    while (true) {
      if (buffer.length === 0) {
        const readResult = await denoReader.read();
        buffer = readResult.value;
      }
      handleBuffer(this.tui, buffer);
      // console.log(buffer);
      // this.tui.emit("key", buffer[0]);
      if (this.state == "cancel") {
        break;
      }
      buffer = new Uint8Array(0);
    }
  }
}

function handleKeyInputNode(tui) {
  let onData = (b) => {
    let buffer = new Uint8Array(b.buffer);
    handleBuffer(tui, buffer);
  };

  process.stdin.on("data", onData);
  process.stdin.resume();
}

async function handleKeyboardInput(tui) {
  // const async handleKeyboardInput = (tui) => {
  if (globalThis.Deno) {
    Deno.stdin.setRaw(true);
    for await (const chunk of Deno.stdin.readable) {
    }
  } else {
    handleKeyInputNode(tui);
  }
}

export function print(string) {
  if (typeof process === "object") {
    process.stdout.write(string); // We can write without a trailing newline
  } else if (typeof Deno === "object") {
    Deno.stdout.writeSync(new TextEncoder().encode(string)); // We can write without a trailing newline
  } else {
    console.log(string); // We're in a browser. Newlines are mandated
  }
}

function createEnum(values) {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
}

const CursorVisibility = createEnum(["Visible", "Hidden"]);

const AltScreenState = createEnum(["Active", "Inactive"]);

const escape = (code) => {
  print("\x1b[" + code);
};

const escape_seq = (code) => {
  return "\x1b[" + code;
};

const enter_alt_screen = () => {
  escape("?1049h");
};

const exit_alt_screen = () => {
  escape("?1049l");
};

const clear_line = () => {
  escape("2K");
};

const cursor_up = (x) => {
  escape(`${x}` + "A");
};

const cursor_up_seq = (x) => {
  return escape_seq(`${x}` + "A");
};

const clear_line_seq = () => {
  return escape_seq("2K");
};

const move_cursor = (x, y) => {
  escape(`${x};${y}H`);
};

const cursor_back = (x) => {
  escape(`${x}D`);
};

const cursor_back_seq = (x) => {
  return escape_seq(`${x}` + "D");
}

const show_cursor = () => {
  escape("?25h");
};

const hide_cursor = () => {
  escape("?25l");
};

const erase_display_seq = (x) => {
  escape(`${x}J`);
};

const set_window_title_seq = (title) => {
  print("\x1b]2;" + title + "\x07");
};

const clear = () => {
  erase_display_seq(2);
  move_cursor(1, 1);
};

// import * as fs from 'node:fs';
// function log(text) {
  // fs.appendFile("log.txt", text, (err) => {});
// }

class Renderer extends EventEmitter {
  #buffer = "";
  #width = 0;
  #height = 0;
  #last_render = "";
  altscreen_state = AltScreenState.Inactive;
  #lines_rendered = 0;
  #cursor_visibility = CursorVisibility.Visible;
  #refresh_delay;
  #runner;
  #nextUpdateTimeout;

  constructor(refresh_delay, runner) {
    super();
    this.#refresh_delay = refresh_delay;
    this.#runner = runner;
  }

  #render(string) {
    this.#buffer = string;
  }

  #tick() {
    let now = 10;
    if (this.#isEmpty() || this.#sameAsLastFlush()) {
    } else {
      this.#flush();
    }
    const updateStep = () => {
      const renderer = this;
      this.#nextUpdateTimeout = setTimeout(() => {
        renderer.emit("tick", "tick");
      }, this.#refresh_delay);
    };

    updateStep();
    // this.#runner.emit("tick", now);
  }

  #flush() {
    let new_lines = this.#lines();
    let new_lines_this_flush = new_lines.length;
    let clear_sequence = new Array();

    if (this.#lines_rendered > 0) {
      for (let i = this.#lines_rendered; i > 0; i--) {
        clear_sequence.push(clear_line_seq());
        clear_sequence.push(cursor_up_seq(1));
      }
    }
    // extra clear line to prevent phantom length lines
        clear_sequence.push(clear_line_seq());

    let tmp = new_lines.join("\r\n");
    // log(clear_sequence.join("") + tmp + "\r\n" + cursor_back_seq(100));
    print(clear_sequence.join("") + tmp + "\r\n");
    if (this.altscreen_state == AltScreenState.Active) {
      move_cursor(new_lines_this_flush, 0);
    } else {
      // log("moved cursor")
      cursor_back(this.#width);
      // cursor_back(100);
      // console.log(cursor_back_seq(100))
    }

    this.#last_render = this.#buffer;
    this.#lines_rendered = new_lines_this_flush;
    this.#buffer = "";
  }

  #handleSetCursorVisibility(new_cursor_visibility) {
    if (this.#cursor_visibility !== new_cursor_visibility) {
      if (new_cursor_visibility == CursorVisibility.Hidden) {
        hide_cursor();
      } else {
        show_cursor();
      }
      this.#cursor_visibility = new_cursor_visibility;
    }
  }

  internalHideCursor() {
    hide_cursor();
    this.#cursor_visibility = CursorVisibility.Hidden;
  }

  internalShowCursor() {
    show_cursor();
    this.#cursor_visibility = CursorVisibility.Visible;
  }

  handleEnterAltScreen() {
    if (this.altscreen_state == AltScreenState.Inactive) {
      enter_alt_screen();
      clear();
      this.altscreen_state = AltScreenState.Active;
      this.#last_render = "";
    }
  }

  handleExitAltScreen() {
    if (this.altscreen_state == AltScreenState.Active) {
      exit_alt_screen();
      this.altscreen_state = AltScreenState.Inactive;
      this.#last_render = "";
    }
  }

  repaint() {
      this.#last_render = "";
  }

  #restore() {
    if (this.#cursor_visibility == CursorVisibility.Hidden) {
      show_cursor();
    }
  }

  #shutdown() {
    this.off();
    clearTimeout(this.#nextUpdateTimeout);
    // this.#flush();
    this.#restore();
  }

  #isEmpty() {
    return this.#buffer === "";
  }

  #sameAsLastFlush() {
    return this.#buffer === this.#last_render;
  }

  #lines() {
    if (this.#isEmpty()) {
      return [];
    }
    return this.#buffer.split("\n");
  }

  run() {
    this.on("render", (string) => {
      this.#render(string);
    });
    this.on("tick", (a) => {
      this.#tick();
    });
    this.on("cursor_visibility", (cursor_visibility) => {
      this.#handleSetCursorVisibility(cursor_visibility);
    });
    this.on("shutdown", () => this.#shutdown());
    this.on("enter_alt_screen", () => this.handleEnterAltScreen());
    this.on("exit_alt_screen", () => this.handleExitAltScreen());
    this.#tick();
  }

  show_cursor() {
    this.emit("cursor_visibility", CursorVisibility.Visible);
  }
  hide_cursor() {
    this.emit("cursor_visibility", CursorVisibility.Hidden);
  }

  render(string) {
    this.emit("render", string);
  }

  shutdown() {
    this.emit("shutdown");
  }

  enter_alt_screen() {
    this.emit("enter_alt_screen");
  }

  exit_alt_screen() {
    this.emit("exit_alt_screen");
  }
}

export class App extends EventEmitter {
  #init;
  #update;
  #view;
  #model;
  #renderer;
  #refreshDelay = 20;
  #initAltScreen = new AltScreenDisabled();
  #denoListener;
  #pausedAltScreenState;
  #queue = [];
  #commands = [];

  #handleNewEvent(event) {
    this.#queue.push(event)
    this.#flush()
  }

  #flush() {
    if (this.#queue.length) {
      while (this.#queue.length) {
        this.#handleEvent(this.#queue.shift())
      }
    }

    while (this.#commands.length) {
      this.#handleCommand(this.#commands.shift())
    }

    if (this.#queue.length) {
      this.#flush()
    }
  }

  initializeTerminal() {
    if (globalThis.Deno) {
      Deno.stdin.setRaw(true);
    } else {
      process.stdin.setRawMode(true);
    }
    this.#renderer.internalHideCursor();
  }

  createKeyboardListener() {
    if (globalThis.Deno) {
      this.#denoListener = handleKeyInputDeno(this);
    } else handleKeyInputNode(this);
  }

  #pauseKeyboardInput() {
    // console.log("paused");
    if (globalThis.Deno) {
      this.#denoListener.emit("cancel");
      this.#denoListener = null;
    } else {
      process.stdin.pause();
    }
  }

  #resumeKeyboardInput() {
    // console.log("resumed");
    if (globalThis.Deno) {
      this.createKeyboardListener();
    } else {
      process.stdin.resume();
    }
  }

  releaseTerminal() {
    this.#pauseKeyboardInput();
    this.#renderer.shutdown();
    this.#pausedAltScreenState = this.#renderer.altscreen_state;
    this.restoreTerminalState();
  }

  restoreTerminal() {
    this.initializeTerminal();
    this.#resumeKeyboardInput();
    if (this.#pausedAltScreenState == AltScreenState.Active) {
      this.#renderer.handleEnterAltScreen();
    } else {
      this.#renderer.repaint()
    }
    this.#renderer.run();
    // resize
    if (globalThis.Deno) {
      let size = Deno.consoleSize();
      this.#emitResizeEvent(size.columns, size.rows);
    } else {
      this.#emitResizeEvent(process.stdout.columns, process.stdout.rows);
    }
  }

  restoreTerminalState() {
    this.#renderer.internalShowCursor();
    this.#renderer.handleExitAltScreen();

    if (globalThis.Deno) {
      try {
        Deno.stdin.setRaw(false);
      } catch {
        /**/
      }
    } else {
      process.stdin.setRawMode(false);
    }
  }

  setRefreshDelay(value) {
    this.#refreshDelay = value;
    return this;
  }

  setAltScreen() {
    this.#initAltScreen = new AltScreenEnabled();
    return this;
  }

  constructor(init, update, view) {
    super();
    this.#init = init;
    this.#update = update;
    this.#view = view;
  }

  run(flags) {
    // this.#refreshDelay = options.refresh_delay;
    this.dispatch();
    const self = this;
    // handleKeyboardInput(self);
    this.#listenForResize();

    const renderer = new Renderer(this.#refreshDelay, self);
    renderer.run();
    this.#renderer = renderer;
    this.initializeTerminal();
    this.createKeyboardListener();

    if (this.#initAltScreen instanceof AltScreenEnabled) {
      this.#renderer.enter_alt_screen();
    }

    let [model, init_command] = this.#init(flags);
    this.#handleCommand(init_command);

    this.#model = model;

    let view = this.#view(model);
    this.#renderer.render(view);

    this.on("custom_messages", (msg) => {
      let event = new CustomEvent(msg);
      this.#handleNewEvent(event);
    });
    // this.on("tick", (int) => {
    //   let frame = new Frame(int);
    //   this.#handleNewEvent(frame);
    // });
    this.on("effectDispatch", (msg) => {
      let event = new CustomEvent(msg);
      this.#handleNewEvent(event);
    });
    this.on("terminalResize", (size) => {
      this.#handleNewEvent(new Resize(size.width, size.height));
    });
    this.on("keyPress", (key) => {
      let parsed_key = parse_key_type(key);
      let modifier_key = handle_modifier(key, parsed_key);

      this.#handleNewEvent(new KeyEvent(modifier_key));
    });
    this.on("timers", (msg) => {
      let event = new CustomEvent(msg);
      this.#handleNewEvent(event);
    });
    if (globalThis.Deno) {
      let size = Deno.consoleSize();
      this.#emitResizeEvent(size.columns, size.rows);
    } else {
      this.#emitResizeEvent(process.stdout.columns, process.stdout.rows);
    }

    return (action) => this.handleAction(action);
  }

  handleAction(action) {
    switch (true) {
      case action[0] instanceof Shutdown:
        this.emit("destroy");
        break;
      case action[0] instanceof Send:
        let msg = action[0][0];
        this.send(msg);
        break;
      case action[0] instanceof WindowTitle:
        let title = action[0][0];
        set_window_title_seq(title);
        break;
    }
  }
  #handleEvent(event) {
    let [model, command] = this.#update(this.#model, event);
    let updated_view = this.#view(model);
    this.#handleNewCommand(command);
    this.#renderer.render(updated_view);
    this.#model = model;
  }

  #handleNewCommand(command) {
    this.#commands.push(command)
  }

  #setTimer(msg, duration) {
    setTimeout(() => {
      this.emit("timers", msg);
    }, duration.milliseconds);
  }

  #handleCommand(command) {
    switch (true) {
      case command[0] instanceof Quit:
        this.emit("destroy");
        break;
      case command[0] instanceof Noop:
        break;
      case command[0] instanceof ExecuteProcess:
        let program = command[0][0];
        let args = command[0][1].toArray();
        this.releaseTerminal()
        child_process.spawnSync(program, args, {stdio: "inherit"})
        this.restoreTerminal()
        break
      case command[0] instanceof ClearScreen:
        clear();
        break;
      case command[0] instanceof SetTimer:
        let msg = command[0][0];
        let duration = command[0][1];
        this.#setTimer(msg, duration);
        break;
      case command[0] instanceof HideCursor:
        this.#renderer.hide_cursor();
        break;
      case command[0] instanceof ShowCursor:
        this.#renderer.show_cursor();
        break;
      case command[0] instanceof EnterAltScreen:
        this.#renderer.enter_alt_screen();
        break;
      case command[0] instanceof ExitAltScreen:
        this.#renderer.exit_alt_screen();
        break;
      case command[0] instanceof SetWindowTitle:
        let title = command[0][0];
        set_window_title_seq(title);
        break;
      case command[0] instanceof Seq:
        let cmds = command[0][0];
        for (const cmd of cmds) {
          this.#handleNewCommand(cmd);
        }
        break;
      case command[0] instanceof CustomCommand:
        let effect = command[0][0];
        effect((msg) => this.effectDispatch(msg));
        break;
    }
  }

  effectDispatch(msg) {
    this.emit("effectDispatch", msg);
  }

  send(msg) {
    this.emit("custom_messages", msg);
  }

  destroy() {
    this.off();

    // this.#renderer.render(this.#view(this.#model))
    this.#renderer.exit_alt_screen();
    this.#renderer.shutdown();

    if (globalThis.Deno) {
      try {
        Deno.stdin.setRaw(false);
      } catch {
        /**/
      }
    } else {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }
  }

  #emitResizeEvent(width, height) {
    this.emit("terminalResize", { width: width, height: height });
  }

  #listenForResize() {
    if (globalThis.Deno) {
      if (Deno.build.os === "windows") {
        setInterval(() => {
          let size = Deno.consoleSize();
          this.#emitResizeEvent(size.columns, size.rows);
        }, this.#refreshDelay);
      } else {
        Deno.addSignalListener("SIGWINCH", () => {
          let size = Deno.consoleSize();
          this.#emitResizeEvent(size.columns, size.rows);
        });
      }
    } else {
      if (process.platform == "win32") {
        setInterval(() => {
          this.#emitResizeEvent(process.stdout.columns, process.stdout.rows);
        }, this.#refreshDelay);
      } else {
        process.on("SIGWINCH", () => {
          this.#emitResizeEvent(process.stdout.columns, process.stdout.rows);
        });
      }
    }
  }

  dispatch() {
    const destroyDispatcher = () => {
      this.emit("destroy");
    };

    if (globalThis.Deno) {
      if (Deno.build.os === "windows") {
        Deno.addSignalListener("SIGBREAK", destroyDispatcher);

        this.on("keyPress", ({ key, ctrl }) => {
          if (ctrl && key === "c") destroyDispatcher();
        });
      } else {
        Deno.addSignalListener("SIGTERM", destroyDispatcher);
      }

      Deno.addSignalListener("SIGINT", destroyDispatcher);
    } else {
      process.on("SIGTERM", destroyDispatcher);
      process.on("SIGINT", destroyDispatcher);
    }
    const exit = () => {
      if (globalThis.Deno) {
        Deno.exit(0);
      } else {
        process.exit(0);
      }
    };

    this.on("destroy", async () => {
      this.destroy();
      await Promise.resolve();
      exit();
    });
  }
}

export const setup = (init, update, view) => new App(init, update, view);
export const run = (app, flags) => app.run(flags);
export const set_refresh_delay = (app, refresh_delay) =>
  app.setRefreshDelay(refresh_delay);
export const set_alt_screen = (app) => app.setAltScreen();
