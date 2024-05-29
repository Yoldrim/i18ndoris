import { Message, TranslationVars } from "./interfaces";
import {createKeyFromString, createKeyWithContextString } from "./util";

const valueMarker = /{{\w*}}/g;

let initialized = false;
let translations: Message[];
let allTranslations: {[key: string]: Message[]};

const populateWithVars = (message: string, vars: TranslationVars) => {
  let indices: number[] = [];
  const matches = message.match(valueMarker) || []
  for (let result of matches) {
    message = message.replace(result, vars[result.slice(2, -2)]);
  }

  for (let i in indices) {
    message = message.replace(valueMarker, vars[i]);
  }
  return message;
}

export const setTranslations = (locale: string) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }
  translations = allTranslations[locale];
}

export const init = (initialLocale: string, locales: {[key: string]: Message[]}) => {
  initialized = true;
  allTranslations = locales;
  setTranslations(initialLocale);
}

export const t = (s: string, vars?: TranslationVars) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }

  let tr = translations.find((message) => message.id === createKeyFromString(s))?.defaultMessage
  if (tr && vars) {
    tr = populateWithVars(tr, vars);
  }

  return tr || '';
}

export const ct = (c: string, s: string, vars?: TranslationVars) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }


  let tr = translations.find((message) => message.id === createKeyWithContextString(c, s))?.defaultMessage
  if (tr && vars) {
    tr = populateWithVars(tr, vars);
  }

  return tr;
}