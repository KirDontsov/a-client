export function getNumberInRange(value: number, min?: number, max?: number): number {
  if (min && value < min) {
    return min;
  }

  if (max && value > max) {
    return max;
  }

  return value;
}
