'use client';

import React, { ClassType } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';
import { CONFIG } from '@/commons';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isEmpty = (value: any, isAllowZeroNumber?: boolean) => {
  if (
    `${value}`.trim() === `` ||
    value === null ||
    value === undefined ||
    (!isAllowZeroNumber && (value === 0 || value === `0`)) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === `object` &&
      Object.entries(value).length === 0 &&
      value.constructor === Object)
  ) {
    return true;
  }

  return false;
};

export const isNull = (value: any) => {
  if (value === null) {
    return true;
  }
};

export const isFunction = (value: any) => {
  if (typeof value === `function`) {
    return true;
  }
};

export const isBoolean = (value: any) => {
  if (typeof value === `boolean`) {
    return true;
  }
};

export const isObject = (value: any) => {
  if (!isEmpty(value) && typeof value === `object`) {
    return true;
  }
};

export const isArray = (value: any) => {
  if (!isEmpty(value) && Array.isArray(value)) {
    return true;
  }
};

export const isString = (value: any) => {
  if (typeof value === `string`) {
    return true;
  }
};

export const isInteger = (str: any) => {
  return /^\+?(0|[1-9]\d*)$/.test(str);
};

export const isNumber = (value: any) => {
  if (typeof value === `number` && Number.isFinite(value)) {
    return true;
  }

  if (
    typeof value === `string` &&
    value.trim() !== `` &&
    !Number.isNaN(Number(value))
  ) {
    return true;
  }

  return false;
};

export const isJson = (string: string) => {
  if (
    !isEmpty(string) &&
    /^[\],:{}\s]*$/.test(
      string
        .replace(/\\["\\/bfnrtu]/g, `@`)
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
          `]`,
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ``),
    )
  ) {
    return true;
  }

  return false;
};

export const isEmail = (string: string) => {
  if (
    !isEmpty(string) &&
    /^[\w\-.+]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,4}$/.test(string)
  ) {
    return true;
  }
  return false;
};

export const cleanString = (input: string) => {
  return input
    .split(``)
    .map((char) => {
      return char.charCodeAt(0) <= 127 ? char : ``;
    })
    .join(``);
};

export const isUrl = (url: string) => {
  if (isEmpty(url)) {
    return false;
  }
  const regexp = new RegExp(
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
  );
  return regexp.test(url);
};

export const isYouTubeUrl = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11;
};

export const addCommasToNumber = (num: string | number, decimal = 2) => {
  let number = num;

  if (number === undefined || number === null || number === ``) {
    number = 0;
  }

  try {
    number = Number(number);
  } catch (error) {
    number = 0;
  }

  if (Number.isNaN(number)) {
    number = 0;
  }

  const isNegative = `${number}`.at(0) === `-`;
  let [n, d = 0] = `${number}`.split(`.`);

  n = Math.abs(parseInt(n, 10))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, `,`);

  d = Number(`.${d}`).toFixed(decimal);
  d = d.slice(1);

  return `${isNegative ? `-` : ``}${n}${d}`;
};

export const removeCommasFromString = (string: string) => {
  return string.replace(/,/g, ``);
};

export const convertNumberToAbbreviation = (value: string) => {
  const number = parseInt(value, 10);

  if (number === 0) {
    return `0.00`;
  }
};

export const capitalizeString = (item = ``) => {
  return item.charAt(0).toUpperCase() + item.slice(1);
};

export const convertStringToTitleCase = (str = ``) => {
  return str
    .split(` `)
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    })
    .join(` `);
};

export const convertStringToSentenceCase = (string = ``) => {
  return string.replace(/\.\s+([a-z])[^.]|^(\s*[a-z])[^.]/g, (str) => {
    return str.replace(/([a-z])/, (str1) => {
      return str1.toUpperCase();
    });
  });
};

export const roundUp = (num = 0, precision = 0) => {
  let prec = precision;

  prec = Math.pow(10, prec);
  return Math.ceil(num * prec) / prec;
};

export const convertUnderScoreToCamelCased = (myString = ``) => {
  return myString.replace(/-([a-z])/g, (str, group1) => {
    return group1.toUpperCase();
  });
};

export const convertPascalCasedToUnderScore = (myString = ``) => {
  return myString
    .replace(/\.?([A-Z])/g, (val1, val2) => {
      return `_` + val2.toLowerCase();
    })
    .replace(/^_/, ``);
};

export const convertUnderScoreCasedToPascal = (myString = ``) => {
  return `${myString}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, `g`), ` `)
    .replace(new RegExp(/[^\w\s]/, `g`), ``)
    .replace(new RegExp(/\s+(.)(\w*)/, `g`), (val1, val2, val3) => {
      return `${val2.toUpperCase() + val3}`;
    })
    .replace(new RegExp(/\w/), (str) => {
      return str.toUpperCase();
    });
};

export const swapJsonObjectKeyValue = (obj: object) => {
  const ret = {};

  Object.entries(obj).forEach(([key, value]: [string, string]) => {
    Object.assign(ret, {
      [value]: key,
    });
  });

  return ret;
};

export const getIndexOfLastOccurenceOfCharacter = (
  string = ``,
  character = ``,
) => {
  return string.lastIndexOf(character) + 1;
};

export const subString = (string = ``, startFrom = 0, endAt = 0) => {
  return string.substring(startFrom, endAt);
};

export const randomInteger = (min = 0, max = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffleArray = (arr: any[]) => {
  return arr
    .map((val1) => {
      return [Math.random(), val1];
    })
    .sort((val1, val2) => {
      return val1[0] - val2[0];
    })
    .map((val1) => {
      return val1[1];
    });
};

export const truncateString = (string = ``, paramN = 0) => {
  const str = String(string);
  const num = paramN;

  if (str.length < num) {
    return str;
  }
  return str.substring(0, num) + `...`;
};

export const getExtensionFromUrl = (paramsUrl: string) => {
  let url = paramsUrl;
  url = `${url}`.toLowerCase();
  let extension = ``;
  const splittedUrl = url.split(`.`).reverse();

  if (splittedUrl.length > 0) {
    [extension] = splittedUrl;
  }

  return extension;
};

export const replaceAll = (
  str: string,
  search: string,
  replacement: string,
) => {
  return str.split(search).join(replacement);
};

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
};

export const removeHtmlTags = (str: string) => {
  return String(str).replace(/<(.|\n)*?>/g, ``);
};

export const convertUrlParametersToJson = (urlParam: string) => {
  const obj = {};

  String(urlParam)
    .split(`&`)
    .forEach((str) => {
      const [key, value] = str.split(`=`);
      Object.assign(obj, {
        [key]: value,
      });
    });

  return obj;
};

export const convertObjectToUrlParameters = (obj: object) => {
  const str = [];

  for (const key in obj) {
    if (Array.isArray(obj[key as keyof typeof obj])) {
      (obj[key as keyof typeof obj] as string[]).forEach((item) => {
        str.push(`${key}[]=${item}`);
      });
    } else if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(
        encodeURIComponent(key) +
          `=` +
          encodeURIComponent(obj[key as keyof typeof obj]),
      );
    }
  }

  return str.join(`&`);
};

export const invertColor = (code: any) => {
  const colorRgba = code
    .replace(/^(rgb|rgba)\(/, ``)
    .replace(/\)$/, ``)
    .replace(/\s/g, ``)
    .split(`,`);
  const [rVal, gVal, bVal, aVal]: [number, number, number, number] = colorRgba;

  return `rgba(${255 - rVal}, ${255 - gVal}, ${255 - bVal}, ${aVal})`;
};

export const isEven = (number: string) => {
  let num = 0;
  num = parseInt(number, 10);

  return num % 2 === 0;
};

export const convertJSONToCSV = (items = []) => {
  const replacer = (key: string, value: string) => {
    return value === null ? `` : value;
  };

  const header = Object.keys(items[0]);
  const csv = [
    header
      .map((key) => {
        return `"${key}"`;
      })
      .join(`,`), // header row first
    ...items.map((row) => {
      return header
        .map((fieldName) => {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(`,`);
    }),
  ].join(`\r\n`);

  return csv;
};

export const convertCSVToJSON = (csv: string) => {
  const items: object[] = [];

  const rows = csv.split(/\r\n|\n|\r/);
  const keys = (rows.shift() ?? ``).replaceAll(`"`, ``).split(`,`);

  rows.forEach((raw_row) => {
    let row = {};
    const columns = raw_row
      .replaceAll(`"`, ``)
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    columns.forEach((column, index) => {
      const key = keys[index];

      if (!key) {
        return;
      }
      row = { [key]: column };
    });
    items.push(row);
  });

  return items;
};

export const censor = (censor: object) => {
  let i = 0;

  return (key: any, value: object) => {
    if (
      i !== 0 &&
      typeof censor === `object` &&
      typeof value === `object` &&
      censor === value
    ) {
      return `[Circular]`;
    }

    if (i >= 29) {
      return `[Unknown]`;
    }

    i += 1;

    return value;
  };
};

type DeepClone = (
  obj: ClassType<any, any, any>,
  hash?: WeakMap<any, any>,
) => any;

export const deepClone: DeepClone = (obj, hash) => {
  // Do not try to clone primitives or functions
  if (Object(obj) !== obj || obj instanceof Function) {
    return obj;
  }
  if (React.isValidElement(obj)) {
    return `[Component]`;
  }

  if (hash) {
    if (hash.has(obj)) {
      return hash.get(obj);
    } // Cyclic reference
  }
  let result: any = {};

  try {
    // Try to run constructor (without arguments, as we don't know them)
    result = new obj.constructor();
  } catch (e) {
    // Constructor failed, create object without running the constructor
    result = Object.create(Object.getPrototypeOf(obj));
  }
  // Optional: support for some standard constructors (extend as desired)
  if (obj instanceof Map) {
    Array.from(obj, ([key, val]) => {
      return result.set(deepClone(key, hash), deepClone(val, hash));
    });
  } else if (obj instanceof Set) {
    Array.from(obj, (key) => {
      return result.add(deepClone(key, hash));
    });
  }
  // Register in hash
  if (hash) {
    hash.set(obj, result);
  }
  // Clone and assign enumerable own properties recursively
  return Object.assign(
    result,
    ...Object.keys(obj).map((key) => {
      return { [key]: deepClone(obj[key], hash) };
    }),
  );
};

export const stringify = (object: any) => {
  return JSON.stringify(deepClone(object));
};

export const encryptData = (text: string) => {
  const ALGORITHM = `aes-256-ctr`;
  const ENCRYPTION_KEY = Buffer.concat(
    [Buffer.from(CONFIG.SECRET_KEY), Buffer.alloc(32)],
    32,
  );
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString(`hex`) + `:` + encrypted.toString(`hex`);
};

export const decryptData = (text: string) => {
  const ALGORITHM = `aes-256-ctr`;
  const ENCRYPTION_KEY = Buffer.concat(
    [Buffer.from(CONFIG.SECRET_KEY), Buffer.alloc(32)],
    32,
  );
  const textParts = text.split(`:`);
  const iv = Buffer.from(textParts.shift() ?? ``, `hex`);
  const encryptedText = Buffer.from(textParts.join(`:`), `hex`);
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export const truncateMiddleWords = (
  text: string,
  frontCharCount: number = 3,
  backCharCount: number = 2,
) => {
  if (frontCharCount + backCharCount >= text.length) {
    return text;
  }

  const frontChar = text.substring(0, frontCharCount);
  const backChar = text.substring(text.length - backCharCount);

  return frontChar + `...` + backChar;
};

export const allowNumberInputOnly = (value: string) => {
  const regex: RegExp = /^[0-9]+$/;

  const isNumberic = regex.test(value);

  if (!isNumberic) {
    return value.replace(/\D/g, ``);
  }

  return value;
};
