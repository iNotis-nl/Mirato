import {Img} from "$utils/html";

export function parseIntOrZero(v: string): number {
  const i: number = parseInt(v);
  if (isNaN(i)) {
    return 0;
  }
  return i;
}

export function ucFirst(s: string): string {
  return s[0]?.toUpperCase() + s?.substring(1);
}

export function ratio(numWorkplaces: number, numEmployees: number): string {
  const ratio: number = Math.round((numEmployees == 0 ? 0 : numWorkplaces / numEmployees) * 100);
  return ratio + '%';
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

// @ts-ignore
window.IdList = new Array<string>();

export function createId(namespace: string): string {
  let id: string = namespace + '-' + createRandom(5);
  // @ts-ignore
  if (window.IdList.indexOf(id) > -1 || document.getElementById(id) !== null) {
    return createId(namespace);
  }

  return id;
}

export function createRandom(length: number): string {
  let rand: string = crypto.randomUUID().replace(/[^0-9aeiouy]/gi, '');
  while (rand.length < length) {
    rand = rand + crypto.randomUUID().replace(/[^0-9aeiouy]/gi, '');
  }
  return rand.substring(0, length);
}

export function TooltipIcon(tooltip: string): HTMLImageElement {
  const src: string = 'https://uploads-ssl.webflow.com/62691a9a7781f77d01732f92/6409d1826dd2b4aec44b4b00_info_FILL0_wght500_GRAD-25_opsz20.svg';
  return Img.build(src, ['tooltip-icon'], {
    'loading': 'lazy',
    'alt': '',
    'title': tooltip,
  });
}

export class Facility {
  public readonly name: string;
  public active: boolean;
  public readonly callbackFn;
  public readonly readonly: boolean;
  public readonly tooltip: string;

  constructor(name: string,
              active: boolean,
              callbackForM2: (subtotalM3: number,
                              numWorkstations: number) => number,
              readonly: boolean = false,
              tooltip: string = ''
  ) {
    this.name = name;
    this.active = active;
    this.callbackFn = callbackForM2;
    this.readonly = readonly;
    this.tooltip = tooltip;
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
    this.callbackFn = (): number => {
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
  public readonly tooltip: string | null = null;
  public amount: number;
  public readonly callbackFn;
  public readonly callbackForPeople;

  constructor(name: string,
              callbackForM2: (amount: number) => number,
              callbackForPeople: (amount: number) => number,
              tooltip: string | null = null,
  ) {
    this.name = name;
    this.amount = 0;
    this.callbackFn = callbackForM2;
    this.callbackForPeople = callbackForPeople;
    this.tooltip = tooltip;
  }

}