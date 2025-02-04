export const serializerHelper = {
  stdClass: function () {},
  stringify(val) {
    const hash = new Map([
      [Infinity, "d:INF;"],
      [-Infinity, "d:-INF;"],
      [NaN, "d:NAN;"],
      [null, "N;"],
      [undefined, "N;"],
    ]);
    const utf8length = (str) =>
      str ? encodeURI(str).match(/(%.)?./g).length : 0;
    const serializeString = (s, delim = '"') =>
      `${utf8length(s)}:${delim[0]}${s}${delim[delim.length - 1]}`;
    let ref = 0;

    function serialize(val, canReference = true) {
      if (hash.has(val)) return hash.get(val);
      ref += canReference;
      if (typeof val === "string") return `s:${serializeString(val)};`;
      if (typeof val === "number")
        return `${Math.round(val) === val ? "i" : "d"}:${("" + val)
          .toUpperCase()
          .replace(/(-?\d)E/, "$1.0E")};`;
      if (typeof val === "boolean") return `b:${+val};`;
      const a = Array.isArray(val) || val.constructor === Object;
      hash.set(val, `${"rR"[+a]}:${ref};`);
      if (typeof val.serialize === "function") {
        return `C:${serializeString(val.constructor.name)}:${serializeString(
          val.serialize(),
          "{}"
        )}`;
      }
      const vals = Object.entries(val).filter(
        ([k, v]) => typeof v !== "function"
      );
      return (
        (a ? "a" : `O:${serializeString(val.constructor.name)}`) +
        `:${vals.length}:{${vals
          .map(
            ([k, v]) =>
              serialize(a && /^\d{1,16}$/.test(k) ? +k : k, false) +
              serialize(v)
          )
          .join("")}}`
      );
    }
    return serialize(val);
  },
  // Provide in second argument the classes that may be instantiated
  //  e.g.  { MyClass1, MyClass2 }
  parse(str, allowedClasses = {}) {
    allowedClasses.stdClass = serializerHelper.stdClass; // Always allowed.
    let offset = 0;
    const values = [null];
    const specialNums = { INF: Infinity, "-INF": -Infinity, NAN: NaN };

    const kick = (msg, i = offset) => {
      throw new Error(`Error at ${i}: ${msg}\n${str}\n${" ".repeat(i)}^`);
    };
    const read = (expected, ret) =>
      expected === str.slice(offset, (offset += expected.length))
        ? ret
        : kick(`Expected '${expected}'`, offset - expected.length);

    function readMatch(regex, msg, terminator = ";") {
      read(":");
      const match = regex.exec(str.slice(offset));
      if (!match)
        kick(
          `Exected ${msg}, but got '${
            str.slice(offset).match(/^[:;{}]|[^:;{}]*/)[0]
          }'`
        );
      offset += match[0].length;
      return read(terminator, match[0]);
    }

    function readUtf8chars(numUtf8Bytes, terminator = "") {
      const i = offset;
      while (numUtf8Bytes > 0) {
        const code = str.charCodeAt(offset++);
        numUtf8Bytes -=
          code < 0x80 ? 1 : code < 0x800 || code >> 11 === 0x1b ? 2 : 3;
      }
      return numUtf8Bytes
        ? kick("Invalid string length", i - 2)
        : read(terminator, str.slice(i, offset));
    }

    const create = (className) =>
      !className
        ? {}
        : allowedClasses[className]
        ? Object.create(allowedClasses[className].prototype)
        : new { [className]: function () {} }[className](); // Create a mock class for this name
    const readBoolean = () => readMatch(/^[01]/, "a '0' or '1'", ";");
    const readInt = () => +readMatch(/^-?\d+/, "an integer", ";");
    const readUInt = (terminator) =>
      +readMatch(/^\d+/, "an unsigned integer", terminator);
    const readString = (terminator = "") =>
      readUtf8chars(readUInt(':"'), '"' + terminator);

    function readDecimal() {
      const num = readMatch(
        /^-?(\d+(\.\d+)?(E[+-]\d+)?|INF)|NAN/,
        "a decimal number",
        ";"
      );
      return num in specialNums ? specialNums[num] : +num;
    }

    function readKey() {
      const typ = str[offset++];
      return typ === "s"
        ? readString(";")
        : typ === "i"
        ? readUInt(";")
        : kick(
            "Expected 's' or 'i' as type for a key, but got ${str[offset-1]}",
            offset - 1
          );
    }

    function readObject(obj) {
      for (let i = 0, length = readUInt(":{"); i < length; i++)
        obj[readKey()] = readValue();
      return read("}", obj);
    }

    function readArray() {
      const obj = readObject({});
      return Object.keys(obj).some((key, i) => key != i)
        ? obj
        : Object.values(obj);
    }

    function readCustomObject(obj) {
      if (typeof obj.unserialize !== "function")
        kick(
          `Instance of ${obj.constructor.name} does not have an "unserialize" method`
        );
      obj.unserialize(readUtf8chars(readUInt(":{")));
      return read("}", obj);
    }

    function readValue() {
      const typ = str[offset++].toLowerCase();
      const ref = values.push(null) - 1;
      const val =
        typ === "n"
          ? read(";", null)
          : typ === "s"
          ? readString(";")
          : typ === "b"
          ? readBoolean()
          : typ === "i"
          ? readInt()
          : typ === "d"
          ? readDecimal()
          : typ === "a"
          ? readArray() // Associative array
          : typ === "o"
          ? readObject(create(readString())) // Object
          : typ === "c"
          ? readCustomObject(create(readString())) // Custom serialized object
          : typ === "r"
          ? values[readInt()] // Backreference
          : kick(`Unexpected type ${typ}`, offset - 1);
      if (typ !== "r") values[ref] = val;
      return val;
    }

    const val = readValue();
    if (offset !== str.length) kick("Unexpected trailing character");
    return val;
  },
};

function isJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch (e) {
    return false;
  }
}

function isSerializedPHP(str) {
  return /^(?:N;|b:[01];|i:\d+;|d:\d+(\.\d+)?;|s:\d+:"|a:\d+:{|O:\d+:"|C:\d+:"|r:\d+;)/.test(
    str
  );
}

export function convertArrayValues(arr) {
  return arr.map((item) => {
    if (typeof item === "string") {
      if (isJSON(item)) {
        return JSON.parse(item);
      } else if (isSerializedPHP(item)) {
        return serializerHelper.parse(item);
      }
    }
    return item;
  });
}

// const serializerHelper = {
//   stringify(value) {
//     const hash = new Map([
//       [Infinity, "d:INF;"],
//       [-Infinity, "d:-INF;"],
//       [NaN, "d:NAN;"],
//       [null, "N;"],
//       [undefined, "N;"],
//     ]);
//     const utf8length = (str) =>
//       str ? encodeURI(str).match(/(%.)?./g).length : 0;
//     const serializeString = (s, delim = '"') =>
//       `${utf8length(s)}:${delim[0]}${s}${delim[delim.length - 1]}`;
//     let ref = 0;

//     function serialize(val, canReference = true) {
//       if (hash.has(val)) return hash.get(val);
//       ref += canReference;
//       if (typeof val === "string") return `s:${serializeString(val)};`;
//       if (typeof val === "number")
//         return `${Math.round(val) === val ? "i" : "d"}:${("" + val)
//           .toUpperCase()
//           .replace(/(-?\d)E/, "$1.0E")};`;
//       if (typeof val === "boolean") return `b:${+val};`;
//       const isArray = Array.isArray(val) || val.constructor === Object;
//       hash.set(val, `${"rR"[+isArray]}:${ref};`);
//       if (typeof val.serialize === "function") {
//         return `C:${serializeString(val.constructor.name)}:${serializeString(
//           val.serialize(),
//           "{}"
//         )}`;
//       }
//       const vals = Object.entries(val).filter(
//         ([k, v]) => typeof v !== "function"
//       );
//       return (
//         (isArray ? "a" : `O:${serializeString(val.constructor.name)}`) +
//         `:${vals.length}:{${vals
//           .map(
//             ([k, v]) =>
//               serialize(isArray && /^\d{1,16}$/.test(k) ? +k : k, false) +
//               serialize(v)
//           )
//           .join("")}}`
//       );
//     }
//     return serialize(value);
//   },

//   parse(str, allowedClasses = {}) {
//     allowedClasses.stdClass = function () {};
//     let offset = 0;
//     const values = [null];
//     const specialNums = { INF: Infinity, "-INF": -Infinity, NAN: NaN };

//     const read = (expected) => {
//       if (expected === str.slice(offset, offset + expected.length)) {
//         offset += expected.length;
//         return;
//       }
//       throw new Error(`Unexpected input at ${offset}`);
//     };

//     function readMatch(regex, terminator = ";") {
//       read(":");
//       const match = regex.exec(str.slice(offset));
//       if (!match) throw new Error(`Invalid input at ${offset}`);
//       offset += match[0].length;
//       read(terminator);
//       return match[0];
//     }

//     function readString() {
//       return readMatch(/^\d+:"(.*?)"/, "");
//     }

//     function readInt() {
//       return +readMatch(/^-?\d+/, ";");
//     }

//     function readBoolean() {
//       return !!+readMatch(/^[01]/, ";");
//     }

//     function readValue() {
//       const type = str[offset++].toLowerCase();
//       console.log("Tipo detectado:", type);

//       if (type === "n") return read(";"), null;
//       if (type === "s") return readString();
//       if (type === "b") return readBoolean();
//       if (type === "i") return readInt();
//       if (type === "d")
//         return parseFloat(
//           readMatch(/^-?\d+(\\.\\d+)?(E[+-]\\d+)?|INF|NAN/, ";")
//         );
//       if (type === "a") return readArray();
//       if (type === "o") return readObject();

//       throw new Error(`Unexpected type ${type} at ${offset - 1}`);
//     }

//     function readArray() {
//       const obj = {};
//       const length = readInt();
//       read(":{");
//       for (let i = 0; i < length; i++) {
//         const key = readValue();
//         obj[key] = readValue();
//       }
//       read("}");
//       return obj;
//     }

//     function readObject() {
//       const obj = {};
//       const className = readString();
//       read(":");
//       return readArray();
//     }

//     const val = readValue();
//     if (offset !== str.length)
//       throw new Error("Unexpected trailing characters");
//     return val;
//   },
// };

// export default serializerHelper;
