import { Pipe, PipeTransform } from '@angular/core';
import { translate, _t } from '@net7/core';

export interface TranslationString {
  [T: string]: string;
}

export function getLanguage() {
  return translate.getCurrentLang();
}

export function getTranslation(s: TranslationString | string, language: string = null): string {
  if (!s) return '';
  if (typeof s === 'string') {
    return s;
  }
  if (language && s[language]) {
    return s[language];
  }
  return s[getLanguage()] || s.en;
}

@Pipe({
  name: 'tranz'
})
export class TranzPipe implements PipeTransform {
  public static tranzform(value: unknown, ...args: unknown[]): string {
    let lang: string = null;
    if (args.length > 0 && typeof (args[0]) === 'string') {
      lang = args[0] as string;
    }
    if (typeof (value) === 'string') {
      if (args.length > 1 && typeof (args[1]) === 'number' && args[1] !== 1) {
        return _t(`${value}s`);
      }
      return _t(value);
    }
    if (typeof (value) === 'object') {
      return getTranslation(value as TranslationString, lang);
    }
    return value as string;
  }

  transform(value: unknown, ...args: unknown[]): string {
    return TranzPipe.tranzform(value, ...args);
  }
}
