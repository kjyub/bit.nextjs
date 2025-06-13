import ky, { type Options } from 'ky';

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER;

const createKyInstance = (options?: Options): typeof ky => {
  return ky.create({
    prefixUrl: URL,
    ...options,
    timeout: 5000,
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('Connection', 'close');
        },
      ],
    },
  });
};

export const tradeInstance = createKyInstance();
