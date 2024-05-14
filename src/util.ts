const fs = require('fs');
const _path = require('path');

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

export const readFileJSON = (path: string) => {
  let file = undefined;
  try {
    file = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(e);
    throw `Could not read file from location ${process.cwd() + path}.\nTry changing the configPath.`;
  }
  return file;
};

export const writeFileJSON = (path: string, content: any) => {
  fs.writeFileSync(path, JSON.stringify(content, null, 2));
};