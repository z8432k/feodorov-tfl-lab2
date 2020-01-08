import { Transform, Readable } from "stream";

const states = new Map([
  ["A", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("L");
          break;
        case "1":
          this._setState("M");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["L", {
    enter() {
      this.push("y");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("C");
          break;
        case "1":
          this._setState("J");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["M", {
    enter() {
      this.push("y");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("E");
          break;
        case "1":
          this._setState("H");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["C", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("B");
          break;
        case "1":
          this._setState("D");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["D", {
    enter() {
      this.push("y");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("E");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["J", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "1":
          this._setState("I");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["B", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("C");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["I", {
    enter() {
      this.push("y");
    },
    process(data) {
      switch(data) {
        case "1":
          this._setState("J");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["H", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("I");
          break;
        case "1":
          this._setState("G");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["G", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "1":
          this._setState("H");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }],
  ["E", {
    enter() {
      this.push("z");
    },
    process(data) {
      switch(data) {
        case "0":
          this._setState("D");
          break;
        default:
          throw new Error(`Unexpected symbol [${data}].`);
      }
    }
  }]
]);

class DFA extends Transform {
  constructor(argv) {
    super(argv);

    this._state = states.get("A");
  }

  _transform(chunk, _encoding, callback) {
    const data = chunk.toString();

    try {
      this._processData(data);
      callback();
    }
    catch (e) {
      callback(e);
    }
  }

  _processData(data) {
    this._state.process.call(this, data);
  }

  _setState(state) {
    if (states.has(state)) {
      this._state = states.get(state);
    }
    else {
      throw new Error(`Unknown state [${state}]`);
    }

    this._state.enter.call(this);
  }
}


async function* generate() {
  yield '0';
  yield '0';
}

Readable.from(generate())
  .pipe(new DFA())
  .on('data', (c) => console.log(c.toString()));
