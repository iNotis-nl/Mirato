import {CheckboxLabel, Div, Input} from "$utils/html";
import {Faculty, getIndex} from "$utils/helpers";

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

  get totalDepartmentM2(): number {
    return this.numWorkstationsM2 + this.totalPersonsRoomsM2 + this.totalPersonConferenceRoomsM2;
  }

  get totalDepartmentM2WithGrowth(): number {
    return Math.ceil(this.totalDepartmentM2 * (1 + (this.expectedGrowth / 100)));
  }

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
  private defaults: Faculty[] = [
    new Faculty('Pantry / Koffiecorner', false, (numEmployees: number) => {
      return Math.ceil(15 * Math.ceil(numEmployees / 50));
    }),
    new Faculty('Lunchruimte', false, (numEmployees: number) => {
      return Math.ceil(numEmployees * 3);
    }),
    new Faculty('Grootkeuken', false, (numEmployees: number) => {
      return Math.ceil(30);
    }),
    new Faculty('Lounge', false, (numEmployees: number) => {
      return Math.ceil(30 * Math.ceil(numEmployees / 100));
    }),
    new Faculty('Gym', false, (numEmployees: number) => {
      return Math.ceil(55);
    }),
    new Faculty('Game/Funruimte', false, (numEmployees: number) => {
      return Math.ceil(40);
    }),
    new Faculty('Bemande receptie', false, (numEmployees: number) => {
      return Math.ceil(30);
    }),
    new Faculty('Kolfruimte', true, (numEmployees: number) => {
      return Math.ceil(5 * Math.ceil(numEmployees / 80));
    }),
    new Faculty('Bidruimte', true, (numEmployees: number) => {
      return Math.ceil(6 * Math.ceil(numEmployees / 80));
    }),
  ];

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);
    this.formField = Div.build(['form-field']);
    this.stack.append(this.formField);
  }

  list(): Faculty[] {
    return this.defaults;
  }

  totalM2(numEmployees: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((faculty: Faculty): void => {
      if (faculty.active) {
        totalM2 += faculty.callbackFn(numEmployees);
      }
    })
    return totalM2;
  }

  add(faculty: Faculty): void {
    this.defaults.push(faculty);
    window.Output?.reset();
  }

  build(): HTMLDivElement {
    this.defaults.forEach((item: Faculty, i: number): void => {
      const el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i]);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let active: boolean = target.checked;
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].active = active;
        window.Output?.reset();
      };
      this.formField.append(el);
    });

    return this.stack;
  }
}

export class ExtraRoomsLayout {
  private name: string = 'Extra ruimtes';
  private readonly stack: HTMLDivElement;
  private readonly inputName: HTMLInputElement;
  private readonly inputM2: HTMLInputElement;
  private readonly formButton: HTMLAnchorElement;

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);

    let extraRooms: HTMLDivElement = Div.build(['metrage_extra-room']);
    this.stack.append(extraRooms);

    this.inputName = Input.build('text', ['form-input', 'w-input'], {'placeholder': 'Naam'});
    extraRooms.append(this.inputName);
    this.inputM2 = Input.build('text', ['form-input', 'w-input'], {'placeholder': 'm²'});
    extraRooms.append(this.inputM2);

    this.formButton = document.createElement('a');
    this.formButton.classList.add('button', 'w-button');
    this.formButton.text = 'Ruimte toevoegen';
    this.formButton.onclick = () => {
      if (this.inputName.value !== '' && this.inputM2.value !== '') {
        window.Form?.facultiesLayout.add(new Faculty(this.inputName.value, true, () => {
          // Fixed value
          return parseInt(this.inputM2.value)
        }));
      }
    };
    extraRooms.append(this.formButton);
  }

  build() {
    return this.stack;
  }
}