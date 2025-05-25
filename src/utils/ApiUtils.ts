import { plainToInstance } from "class-transformer";
import CommonUtils from "./CommonUtils";

export default class ApiUtils {
  static keysToCamel(obj: object) {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.keysToCamel(v));
    } else if (obj && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = `_${CommonUtils.toCamelCase(key)}`;
        acc[camelKey] = this.keysToCamel(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }
  static parseData<T>(typeClass: T, data: object): T {
    const toCamel = this.keysToCamel(data);
    return plainToInstance(typeClass, toCamel);
  }
}
