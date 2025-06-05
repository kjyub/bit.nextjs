namespace TypeUtils {
  export function percent(value: number, round = 0): string {
    return `${Math.round(value * 100 * 10 ** round) / 10 ** round}%`;
  }
  export function round(value: number, round = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    const r = 10 ** round;
    return Math.round(value * r) / r;
  }
}

export default TypeUtils;
