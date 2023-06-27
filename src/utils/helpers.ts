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

export function getIndex(l: string[]): number {
  let index: number = -1;
  l.forEach((v: string): void => {
    if (v.indexOf('index-') === 0) {
      index = parseInt(v.substring(6));
    }
  });
  return index;
}

export class Faculty {
  public readonly name: string;
  public active: boolean;
  public readonly callbackFn;

  constructor(name: string, active: boolean, callbackForM2: (numEmployees:number) => number) {
    this.name = name;
    this.active = active;
    this.callbackFn = callbackForM2;
  }

}