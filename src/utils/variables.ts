import {CheckboxLabel, Div} from "$utils/html";

/**
 * List of Constants used in the tool to calculate the m2 needed
 */
export const MODE_DEPARTMENT: string = 'department';
export const MODE_GLOBAL: string = 'global';


export class OfficeLayout {
  type: string;
  multiplier: number;

  multiplierOptions: { [key: string]: number } = {
    LayoutBasic: 1,
    LayoutSemiOpen: 1.2,
    LayoutComfort: 1.3,
  };

  constructor(type: string) {
    this.type = type;
    this.multiplier = this.multiplierOptions[type];
  }
}

export class DepartmentLayout {
  name: string = "Naam afdeling";
  numEmployees: number = 0;
  expectedGrowth: number = 0;
  numWorkstations: number = 0;
  numCEORooms: number = 0;
  num1PersonRooms: number = 0;
  num2PersonRooms: number = 0;
  num4PersonRooms: number = 0;
  num6PersonRooms: number = 0;
  numCallRooms: number = 0;
  num2PersonConferenceRooms: number = 0;
  num6PersonConferenceRooms: number = 0;
  num10PersonConferenceRooms: number = 0;
  num50PersonConferenceRooms: number = 0;

  get numWorkstationsM2(): number {
    return Math.ceil(this.numWorkstations * 6 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get numCEORoomsM2(): number {
    return Math.ceil(this.numCEORooms * 20 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num1PersonRoomsM2(): number {
    return Math.ceil(this.num1PersonRooms * 12 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num2PersonRoomsM2(): number {
    return Math.ceil(this.num2PersonRooms * 14 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num4PersonRoomsM2(): number {
    return Math.ceil(this.num4PersonRooms * 22 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num6PersonRoomsM2(): number {
    return Math.ceil(this.num6PersonRooms * 30 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get totalPersonsRoomsM2(): number {
    return this.numCEORoomsM2 +
      this.num1PersonRoomsM2 +
      this.num2PersonRoomsM2 +
      this.num4PersonRoomsM2 +
      this.num6PersonRoomsM2;
  }

  get numCallRoomsM2(): number {
    return Math.ceil(this.numCallRooms * 4 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num2PersonConferenceRoomsM2(): number {
    return Math.ceil(this.num2PersonConferenceRooms * 8 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num6PersonConferenceRoomsM2(): number {
    return Math.ceil(this.num6PersonConferenceRooms * 20 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num10PersonConferenceRoomsM2(): number {
    return Math.ceil(this.num10PersonConferenceRooms * 30 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get num50PersonConferenceRoomsM2(): number {
    return Math.ceil(this.num50PersonConferenceRooms * 50 * (window.Form?.officeLayout?.multiplier ?? 1));
  }

  get totalPersonConferenceRoomsM2(): number {
    return this.numCallRoomsM2 +
      this.num2PersonConferenceRoomsM2 +
      this.num6PersonConferenceRoomsM2 +
      this.num10PersonConferenceRoomsM2 +
      this.num50PersonConferenceRoomsM2;
  }
}

export class FacultiesLayout {
  private name: string = 'Faculiteiten';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default Faculties
  private defaults: { [key: string]: boolean } = {
    'Pantry / Koffiecorner': false,
    'Lunchruimte': false,
    'Grootkeuken': false,
    'Lounge': false,
    'Gym': false,
    'Game/Funruimte': false,
    'Bemande receptie': false,
    'Kolfruimte': true,
    'Bidruimte': true,
  };

  constructor() {
    this.stack = Div.build(['stack']);
    let heading = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);
    this.formField = Div.build(['form-field']);
    this.stack.append(this.formField);
  }

  build() {
    Object.keys(this.defaults).forEach((n) => {
      const el = CheckboxLabel.build(n, '1', this.defaults[n]);
      this.formField.append(el);
    });

    return this.stack;
  }
}

export class ExtraRoomsLayout {
  private name: string = 'Extra ruimtes';
  private readonly stack: HTMLDivElement;
  private readonly extraRooms: HTMLDivElement;

  constructor() {
    this.stack = Div.build(['stack']);
    let heading = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);
    this.extraRooms = Div.build(['metrage_extra-room']);
    this.stack.append(this.extraRooms);
  }

  build() {
    return this.stack;
  }
}