import { Message } from "./interfaces/Message";
import {createKeyFromString, createKeyWithContextString } from "./util";

let initialized = false;
let translations: Message[];
let allTranslations: {[key: string]: Message[]};

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