import he from 'he';

export function encodeText(text) {
  return he.encode(text, {
    allowUnsafeSymbols: true,
  });
}

export function decodeText(text) {
  return he.decode(text, {
    allowUnsafeSymbols: true,
  });
}
