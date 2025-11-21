// morseCode.ts
// Dot + Dash (_) based Morse builder + timing utilities

// Morse symbols
export const dot = ".";
export const dash = "_";

export type MorseSymbol = typeof dot | typeof dash;

// Timing rules
export const DOT_UNIT = 1;
export const DASH_UNIT = 3;

export const MORSE_SYMBOL_UNITS: Record<MorseSymbol, number> = {
  [dot]: DOT_UNIT,
  [dash]: DASH_UNIT,
};

export const INTRA_CHAR_GAP = 1;
export const LETTER_GAP = 3;
export const WORD_GAP = 7;

// Build Morse Map using dot + dash
export const MORSE_CODE_TABLE: Record<string, string> = {
  // Letters
  A: dot + dash,
  B: dash + dot + dot + dot,
  C: dash + dot + dash + dot,
  D: dash + dot + dot,
  E: dot,
  F: dot + dot + dash + dot,
  G: dash + dash + dot,
  H: dot + dot + dot + dot,
  I: dot + dot,
  J: dot + dash + dash + dash,
  K: dash + dot + dash,
  L: dot + dash + dot + dot,
  M: dash + dash,
  N: dash + dot,
  O: dash + dash + dash,
  P: dot + dash + dash + dot,
  Q: dash + dash + dot + dash,
  R: dot + dash + dot,
  S: dot + dot + dot,
  T: dash,
  U: dot + dot + dash,
  V: dot + dot + dot + dash,
  W: dot + dash + dash,
  X: dash + dot + dot + dash,
  Y: dash + dot + dash + dash,
  Z: dash + dash + dot + dot,

  // Numbers
  "0": dash + dash + dash + dash + dash,
  "1": dot + dash + dash + dash + dash,
  "2": dot + dot + dash + dash + dash,
  "3": dot + dot + dot + dash + dash,
  "4": dot + dot + dot + dot + dash,
  "5": dot + dot + dot + dot + dot,
  "6": dash + dot + dot + dot + dot,
  "7": dash + dash + dot + dot + dot,
  "8": dash + dash + dash + dot + dot,
  "9": dash + dash + dash + dash + dot,

  // Special symbols
  ".": dot + dash + dot + dash + dot + dash,
  ",": dash + dash + dot + dot + dash + dash,
  "?": dot + dot + dash + dash + dot + dot,
  "'": dot + dash + dash + dash + dash + dot,
  "!": dash + dot + dash + dot + dash + dash,
  "/": dash + dot + dot + dash + dot,
  "(": dash + dot + dash + dash + dot,
  ")": dash + dot + dash + dash + dot + dash,
  "&": dot + dash + dot + dot + dot,
  ":": dash + dash + dash + dot + dot + dot,
  ";": dash + dot + dash + dot + dash + dot,
  "=": dash + dot + dot + dot + dash,
  "+": dot + dash + dot + dash + dot,
  "-": dash + dot + dot + dot + dot + dash,
  _: dot + dot + dash + dash + dot + dash,
  '"': dot + dash + dot + dot + dash + dot,
  $: dot + dot + dot + dash + dot + dot + dash,
  "@": dot + dash + dash + dot + dash + dot,
};

export const ALPHABETS_COLLECTION = Object.keys(MORSE_CODE_TABLE).filter((k) =>
  /^[A-Z]$/.test(k)
);
export const NUMBERS_COLLECTION = Object.keys(MORSE_CODE_TABLE).filter((k) =>
  /^[0-9]$/.test(k)
);
export const SYMBOLS_COLLECTION = Object.keys(MORSE_CODE_TABLE).filter(
  (k) => !/^[A-Z0-9]$/i.test(k)
);

export interface MorseInfo {
  char: string;
  code: string;
  units: number;
}

// Calculate Morse timing for a single character
export function getMorseInfo(char: string): MorseInfo | null {
  const code = MORSE_CODE_TABLE[char.toUpperCase()] ?? MORSE_CODE_TABLE[char];
  if (!code) return null;

  const symbols = code.split("") as MorseSymbol[];

  let units = 0;

  symbols.forEach((symbol, i) => {
    units += MORSE_SYMBOL_UNITS[symbol];
    if (i < symbols.length - 1) units += INTRA_CHAR_GAP;
  });

  return { char, code, units };
}

// Calculate Morse timing for entire text
export function getMorseLength(text: string): number {
  const words = text.split(" ");
  let total = 0;

  words.forEach((word, wIndex) => {
    for (let i = 0; i < word.length; i++) {
      const info = getMorseInfo(word[i]);
      if (!info) continue;

      total += info.units;

      if (i < word.length - 1) {
        total += LETTER_GAP;
      }
    }

    if (wIndex < words.length - 1) {
      total += WORD_GAP;
    }
  });

  return total;
}

// Example:
// console.log(getMorseInfo("A"));
// console.log(getMorseLength("HELLO WORLD"));
