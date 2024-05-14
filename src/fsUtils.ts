import fs from "fs";

export const readFileJSON = (path: string) => {
  let file = undefined;
  try {
    file = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(e);
    throw `Could not read file from location ${path}.\nTry changing the configPath.`;
  }
  return file;
};

export const writeFileJSON = (path: string, content: any) => {
  fs.writeFileSync(path, JSON.stringify(content, null, 2));
};