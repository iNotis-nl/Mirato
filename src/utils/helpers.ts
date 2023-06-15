export function parseIntOrZero(v: string): number {
  const i: number = parseInt(v);
  if (isNaN(i)) {
    return 0;
  }
  return i;
}

export function ucFirst(s: string): string {
  return s[0].toUpperCase() + s.substring(1);
}