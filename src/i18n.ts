import { Message } from "./interfaces/Message";
import {createKeyFromString, createKeyWithContextString, readFileJSON} from "./util";

import fs from 'fs';

let initialized = false;
let tPath: string;
let sLocale: string = 'en';
let tLocales: string[] = [];

let translations: Message[];
let allTranslations: {[key: string]: Message[]};

export const setTranslations = (locale: string) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }
  translations = allTranslations[locale];
}

export const init = (translationsPath: string, sourceLocale: string, targetLocales: string[]) => {
  // Verify translation path
  if (!translationsPath) {
    throw 'Path to translations not supplied.';
  }
  if (!fs.existsSync(translationsPath) || !fs.lstatSync(translationsPath).isDirectory() ) {
    throw `Translation path ${translationsPath} does not exists or is not a directory.`;
  }
  tPath = translationsPath;

  // Verify sourceLocale
  if (!sourceLocale) {
    console.log('No source locale supplied, defaulting to "en"..');
  } else {
    sLocale = sourceLocale;
  }

  // Verify targetLocales
  if (!targetLocales) {
    console.log('No target locales supplied..');
  } else {
    tLocales = targetLocales;
  }

  const loadTranslation = (locale: string) => {
    return readFileJSON(`${tPath}/${locale}.json`);
  }

  for(let l of [sourceLocale, ...tLocales]) {
    loadTranslation(l);
  }

  setTranslations(sLocale);
  initialized = true;
}

export const t = (s: string) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }
  return translations.find((message) => message.id === createKeyFromString(s))?.defaultMessage || '';
}

export const ct = (c: string, s: string) => {
  if (!initialized) {
    throw 'i18njs is not initialized. Did you remember to call init()?'
  }
  return translations.find((message) => message.id === createKeyWithContextString(c, s))?.defaultMessage || '';
}