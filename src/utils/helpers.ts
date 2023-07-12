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

export class Facility {
  public readonly name: string;
  public active: boolean;
  public readonly callbackFn;
  public readonly readonly:boolean;

  constructor(name: string,
              active: boolean,
              callbackForM2: (numEmployees: number,
                              subtotalM3: number,
                              numWorkstations: number) => number,
              readonly: boolean = false
  ) {
    this.name = name;
    this.active = active;
    this.callbackFn = callbackForM2;
    this.readonly = readonly;
  }
}

export class ExtraRoom {
  public readonly name: string;
  public active: boolean = true;
  public m2: number;
  public readonly callbackFn;

  constructor(name: string,
              m2: number
  ) {
    this.name = name;
    this.m2 = m2;
    this.callbackFn = () => {
      if (this.active) {
        console.log(' -', this.name, ' = ', this.m2);
        return this.m2
      }
      return 0;
    };
  }

}

export class MeetingRoom {
  public readonly name: string;
  public amount: number;
  public readonly callbackFn;

  constructor(name: string,
              callbackForM2: (amount: number) => number
  ) {
    this.name = name;
    this.amount = 0;
    this.callbackFn = callbackForM2;
  }

}