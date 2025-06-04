import { plainToInstance } from 'class-transformer';
import CommonUtils from './CommonUtils';

export default class ApiUtils {
  static keysToCamel(obj: object) {
    if (Array.isArray(obj)) {
      return obj.map((v) => ApiUtils.keysToCamel(v));
    } else if (obj && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = `_${CommonUtils.toCamelCase(key)}`;
        acc[camelKey] = ApiUtils.keysToCamel(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }
  static parseData<T>(typeClass: T, data: object): T {
    const toCamel = ApiUtils.keysToCamel(data);
    return plainToInstance(typeClass, toCamel);
  }
}
