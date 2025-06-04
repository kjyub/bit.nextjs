import ky, { type Options } from 'ky';

const URL = process.env.NEXT_PUBLIC_TRADE_SERVER;

const createKyInstance = (options?: Options): typeof ky => {
  return ky.create({ prefixUrl: URL, ...options });
};

export const tradeInstance = createKyInstance();
