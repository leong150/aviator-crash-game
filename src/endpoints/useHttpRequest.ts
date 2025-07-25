import { useMemo } from 'react';
import { MOCK } from '.';
import { CONFIG } from '@/commons';
import { utils } from '@/lib';

const defaultHeaders = {
  Accept: `application/json`,
};

const newAbortSignal = (timeoutMs: number) => {
  const abortController = new AbortController();
  setTimeout(() => {
    return abortController.abort();
  }, timeoutMs || 0);

  return abortController.signal;
};

export const get = async <T>({ url = ``, body = {}, headers = {} }) => {
  return new Promise<{
    status: number;
    data: T;
    message: string;
    current_date_time: string;
  }>((resolve, reject) => {
    setTimeout(async () => {
      try {
        const urlChunks = `${url}`.split(`/`);
        const path = urlChunks[urlChunks.length - 1];
        const domainUrl = url.replace(path, ``);

        let result;
        let responseCode;
        let resultJson: {
          data: any;
          message: string;
          status: number;
          current_date_time: string;
        };

        if (domainUrl === CONFIG.DOMAIN_URL) {
          resultJson = MOCK[path as keyof typeof MOCK];
          responseCode = resultJson.status;
        } else {
          result = await fetch(
            `${url}?${utils.convertObjectToUrlParameters(body)}`,
            {
              method: `GET`,
              headers: {
                ...defaultHeaders,
                ...headers,
              },
              signal: newAbortSignal(60 * 1000),
            },
          );

          resultJson = await result.json();
          responseCode = result.status;
        }

        const { current_date_time, data, message } = resultJson;

        if (responseCode === 200) {
          resolve({
            status: responseCode,
            data,
            message,
            current_date_time,
          });
        } else {
          reject({
            status: responseCode,
            message,
            data,
          });
        }
      } catch (error) {
        const status = 999;

        reject({ status, response: { message: `unknown error` } });
      }
    }, 1000);
  }).finally(() => {});
};

export const post = async <T>({
  url = ``,
  body,
  headers = {},
  shouldStringify = true,
}: {
  url: string;
  body: any;
  headers: any;
  shouldStringify?: boolean;
}) => {
  return new Promise<{
    status: number;
    data: T;
    message: string;
    current_date_time: string;
  }>((resolve, reject) => {
    setTimeout(async () => {
      try {
        const urlChunks = `${url}`.split(`/`);
        const path = urlChunks[urlChunks.length - 1];
        const domainUrl = url.replace(path, ``);

        let result;
        let responseCode;
        let resultJson: {
          data: any;
          message: string;
          status: number;
          current_date_time: string;
        };

        if (domainUrl === CONFIG.DOMAIN_URL) {
          resultJson = MOCK[path as keyof typeof MOCK];
          responseCode = resultJson.status;
        } else {
          result = await fetch(`${url}`, {
            method: `POST`,
            headers: {
              ...defaultHeaders,
              ...(shouldStringify && { 'Content-Type': `application/json` }),
              ...headers,
            },
            body: shouldStringify ? JSON.stringify(body) : body,
            signal: newAbortSignal(60 * 1000),
          });

          resultJson = await result.json();
          responseCode = result.status;
        }

        const { current_date_time, data, message } = resultJson;

        if (responseCode === 200) {
          resolve({ status: responseCode, data, message, current_date_time });
        } else {
          reject({
            status: responseCode,
            message,
            data,
          });
        }
      } catch (error) {
        const status = 999;

        reject({ status, response: { message: `unknown error` } });
      }
    }, 1000);
  }).finally(() => {});
};

export const put = async <T>({ url = ``, body = {}, headers = {} }) => {
  return new Promise<{ status: number; data: T; message: string }>(
    (resolve, reject) => {
      setTimeout(async () => {
        try {
          const urlChunks = `${url}`.split(`/`);
          const path = urlChunks[urlChunks.length - 1];
          const domainUrl = url.replace(path, ``);

          let result;
          let responseCode;
          let resultJson: { data: any; message: string; status: number };

          if (domainUrl === CONFIG.DOMAIN_URL) {
            resultJson = MOCK[path as keyof typeof MOCK];
            responseCode = resultJson.status;
          } else {
            result = await fetch(`${url}`, {
              method: `PUT`,
              headers: {
                ...defaultHeaders,
                'Content-Type': `application/json`,
                ...headers,
              },
              body: JSON.stringify(body),
              signal: newAbortSignal(60 * 1000),
            });

            resultJson = await result.json();
            responseCode = result.status;
          }

          const { data, message } = resultJson;

          if (responseCode === 200) {
            resolve({ status: responseCode, data, message });
          } else {
            reject({
              status: responseCode,
              message,
              data,
            });
          }
        } catch (error) {
          const status = 999;

          reject({ status, response: { message: `unknown error` } });
        }
      }, 1000);
    },
  ).finally(() => {});
};

export const patch = async <T>({ url = ``, body = {}, headers = {} }) => {
  return new Promise<{ status: number; data: T; message: string }>(
    (resolve, reject) => {
      setTimeout(async () => {
        try {
          const urlChunks = `${url}`.split(`/`);
          const path = urlChunks[urlChunks.length - 1];
          const domainUrl = url.replace(path, ``);

          let result;
          let responseCode;
          let resultJson: { data: any; message: string; status: number };

          if (domainUrl === CONFIG.DOMAIN_URL) {
            resultJson = MOCK[path as keyof typeof MOCK];
            responseCode = resultJson.status;
          } else {
            result = await fetch(`${url}`, {
              method: `PATCH`,
              headers: {
                ...defaultHeaders,
                'Content-Type': `application/json`,
                ...headers,
              },
              body: JSON.stringify(body),
              signal: newAbortSignal(60 * 1000),
            });

            resultJson = await result.json();
            responseCode = result.status;
          }

          const { data, message } = resultJson;

          if (responseCode === 200) {
            resolve({ status: responseCode, data, message });
          } else {
            reject({
              status: responseCode,
              message,
              data,
            });
          }
        } catch (error) {
          const status = 999;

          reject({ status, response: { message: `unknown error` } });
        }
      }, 1000);
    },
  ).finally(() => {});
};

const useHttpRequest = () => {
  const HTTPRequest = useMemo(() => {
    return {
      get,
      post,
      put,
      patch,
    };
  }, []);

  return HTTPRequest;
};

export { useHttpRequest };
