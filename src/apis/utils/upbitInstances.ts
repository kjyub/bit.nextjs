import ky, { Options } from 'ky';

const URL = 'https://api.upbit.com/v1';

const createKyInstance = (options?: Options): typeof ky => {
  return ky.create({ prefixUrl: URL, ...options });
};

export const upbitInstance = createKyInstance();
