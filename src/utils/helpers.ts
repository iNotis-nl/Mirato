import {Div, Img} from "$utils/html";
// @ts-ignore
import Fraction from './fractions.js';

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

export function fraction(numWorkplaces: number, numEmployees: number): string {
  if (numEmployees == 0) {
    return '0';
  }
  const ratio: number = ((numEmployees == 0 ? 0 : numWorkplaces / numEmployees) * 100) / 100;
  let frac = new Fraction(ratio);
  return frac.toFraction(false);
}

export function m2Sup(): string {
  return 'M<sup>2</sup>'
}

export function pageBreak(): HTMLDivElement {
  return Div.build(['page-break'], {'style': 'page-break-after:always;'})
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

export function TooltipIcon(tooltip: string | undefined = undefined): HTMLElement {
  const src: string = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" xml:space="preserve"><path xmlns="http://www.w3.org/2000/svg" d="M9.229 13.979h1.563V9.021H9.229ZM10 7.688q.333 0 .573-.23.239-.229.239-.583 0-.333-.229-.573-.229-.24-.583-.24-.333 0-.573.23-.239.229-.239.583 0 .333.229.573.229.24.583.24Zm0 10.27q-1.646 0-3.094-.625t-2.531-1.708q-1.083-1.083-1.708-2.531-.625-1.448-.625-3.094 0-1.667.625-3.104.625-1.438 1.708-2.521t2.531-1.708Q8.354 2.042 10 2.042q1.667 0 3.104.625 1.438.625 2.521 1.708t1.708 2.531q.625 1.448.625 3.094t-.625 3.094q-.625 1.448-1.708 2.531-1.083 1.083-2.531 1.708-1.448.625-3.094.625Zm0-1.625q2.646 0 4.49-1.843 1.843-1.844 1.843-4.49T14.49 5.51Q12.646 3.667 10 3.667T5.51 5.51Q3.667 7.354 3.667 10t1.843 4.49q1.844 1.843 4.49 1.843ZM10 10Z"/></svg>';
  const icon: HTMLImageElement = Img.build('data:image/svg+xml,' + escape(src), ['tooltip-icon'], {
    'loading': 'lazy',
    'alt': '',
    'style': 'width:20px;height:20px'
  });
  if (tooltip) {
    const iconWrap: HTMLDivElement = Div.build(['tooltip-icon-wrap'], {'data-tippy-content': tooltip});
    iconWrap.append(icon);
    return iconWrap;
  }

  return icon;
}

export function DeleteIcon(tooltip: string | undefined = undefined): HTMLElement {
  const src: string = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white"/></svg>';
  const icon: HTMLImageElement = Img.build('data:image/svg+xml,' + escape(src), ['tooltip-icon'], {
    'loading': 'lazy',
    'alt': '',
    'class': 'delete-icon',
    'style': 'width:20px;height:20px'
  });
  if (tooltip) {
    const iconWrap: HTMLDivElement = Div.build(['tooltip-icon-wrap'], {'data-tippy-content': tooltip});
    iconWrap.append(icon);
    return iconWrap;
  }
  return icon;
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
                              numWorkstations: number,
                              numExtraPlaces: number) => number,
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
