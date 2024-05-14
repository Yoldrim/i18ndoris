export const keyifyString = (s: string) => (
  s.trim() // remove starting/trailing whitespaces
  .toLowerCase()
  .replace(/[^\w\s]/g, '') // replace non word characters except whitespace
  .substring(0, 48) // grab first 48 characters
  .trim() // remove trailing whitespaces
  .replace(/\s/g, '_') // replace whitespace with _
)

export const createKeyWithContextString = (ctx: string, s: string) => {
  ctx = keyifyString(ctx);
  s = keyifyString(s);

  return `${ctx}.${s}`;
}

export const createKeyFromString = (s: string) => keyifyString(s)