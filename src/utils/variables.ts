import {CheckboxLabel, Div, Input} from "$utils/html";
import {ExtraRoom, Facility, getIndex, MeetingRoom, parseIntOrZero} from "$utils/helpers";
import {InputFormField} from "$utils/factory";

/**
 * List of Constants used in the tool to calculate the m2 needed
 */
export const MODE_DEPARTMENT: string = 'department';
export const MODE_GLOBAL: string = 'global';


export class OfficeLayout {
  type: string;
  multiplier: number = 1;

  multiplierOptions: { [key: string]: number } = {
    LayoutBasic: 1,
    LayoutSemiOpen: 1.2,
    LayoutComfort: 1.5,
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

  get totalDepartmentM2(): number {
    return this.numWorkstationsM2 + this.totalPersonsRoomsM2;
  }

  get totalGrowth(): number {
    let subTotalDepartment: number = this.totalDepartmentM2;
    let totalDepartment: number = Math.ceil(subTotalDepartment * (this.expectedGrowth / 100));
    console.log('- ', '"' + this.name + '"', 'was ', subTotalDepartment, 'm2 *', this.expectedGrowth + '%', ' = ', totalDepartment);
    return totalDepartment;
  }

  get numWorkstationsM2(): number {
    if (this.numWorkstations > 0) {
      console.log(' -', this.numWorkstations, 'Workstations * 6 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.numWorkstations * 6 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get numCEORoomsM2(): number {
    if (this.numCEORooms > 0) {
      console.log(' -', this.numCEORooms, 'Workstations * 20 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.numCEORooms * 20 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get num1PersonRoomsM2(): number {
    if (this.num1PersonRooms > 0) {
      console.log(' -', this.num1PersonRooms, '1-person room * 12 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.num1PersonRooms * 12 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get num2PersonRoomsM2(): number {
    if (this.num2PersonRooms > 0) {
      console.log(' -', this.num2PersonRooms, '2-person room * 14 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.num2PersonRooms * 14 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get num4PersonRoomsM2(): number {
    if (this.num4PersonRooms > 0) {
      console.log(' -', this.num4PersonRooms, '4-person room * 22 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.num4PersonRooms * 22 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get num6PersonRoomsM2(): number {
    if (this.num6PersonRooms > 0) {
      console.log(' -', this.num6PersonRooms, '6-person room * 30 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
      return Math.ceil(this.num6PersonRooms * 30 * (window.Form?.officeLayout?.multiplier ?? 1));
    }
    return 0;
  }

  get totalPersonsRoomsM2(): number {
    return this.numCEORoomsM2 +
      this.num1PersonRoomsM2 +
      this.num2PersonRoomsM2 +
      this.num4PersonRoomsM2 +
      this.num6PersonRoomsM2;
  }
}

export class MeetingSpaceLayout {
  private name: string = 'Vergaderen';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;


  // Default MeetingRoom
  private defaults: MeetingRoom[] = [
    new MeetingRoom('Aantal belplekken', (amount: number): number => {
      if (amount > 0) {
        console.log(' - Aantal belplekken = ', amount, '* 4 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
        return Math.ceil(amount * 4 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new MeetingRoom('Aantal vergaderruimtes voor 2-4 personen', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 2-people conference = ', amount, '* 8 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
        return Math.ceil(amount * 8 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new MeetingRoom('Aantal vergaderruimtes voor 6-8 personen', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 6-people conference = ', amount, '* 20 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
        return Math.ceil(amount * 20 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new MeetingRoom('Aantal vergaderruimtes voor 10-20 personen', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 10-people conference = ', amount, '* 30 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
        return Math.ceil(amount * 30 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new MeetingRoom('Aantal vergaderruimtes tot 50 personen', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 50-people conference = ', amount, '* 20 m2 *', (window.Form?.officeLayout?.multiplier ?? 1));
        return Math.ceil(amount * 50 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
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

  list(): MeetingRoom[] {
    return this.defaults;
  }

  totalM2(): number {
    let totalM2: number = 0;
    this.defaults.forEach((room: MeetingRoom): void => {
      if (room.amount > 0) {
        totalM2 += room.callbackFn(room.amount);
      }
    })
    return totalM2;
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: MeetingRoom, i: number): void => {
      const el: HTMLDivElement = new InputFormField(['index-' + i]).build(item.name);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let amount: number = parseIntOrZero(target.value);
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].amount = amount;
        window.Output?.reset();
      };
      this.formField.append(el);
    });

    return this.stack;
  }
}

export class FacilitiesLayout {
  private name: string = 'Faciliteiten';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default Facilities
  private defaults: Facility[] = [
    new Facility('Pantry / Koffiecorner', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Pantry / Koffiecorner = 15m2 * ', Math.ceil(numEmployees / 50), '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(15 * Math.ceil(numEmployees / 50) * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Lunchruimte', false, (numEmployees: number, subTotal: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Lunchruimte = 3m2 * ', numWorkstations, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(numWorkstations * 3 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Grootkeuken', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Grootkeuken = 30m2 * ', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(30 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Lounge', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Lounge = 30m2 * ', Math.ceil(numEmployees / 100), '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(30 * Math.ceil(numEmployees / 100) * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Gym', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Gym = 55m2 * ', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(55 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Game/Funruimte', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Game/Funruimte = 40m2 * ', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(40 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Bemande receptie', false, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Bemande receptie = 30m2 * ', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(30 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Lockers', true, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Lockers = 0.05m2 * ', numEmployees, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(numEmployees * 0.05 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Garderobe', true, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Garderobe = 0.05m2 * ', numEmployees, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(numEmployees * 0.05 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Repro', true, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Repro = 0.20m2 * ', numEmployees, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(numEmployees * 0.20 * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
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

  list(): Facility[] {
    return this.defaults;
  }

  totalM2(numEmployees: number, subtotalM3: number, numWorkspaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(numEmployees, subtotalM3, numWorkspaces);
      }
    })
    return totalM2;
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: Facility, i: number): void => {
      const el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i], item.readonly);
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

export class OtherRoomsLayout {
  private name: string = 'Overige ruimtes';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default OtherRooms
  private defaults: Facility[] = [
    new Facility('Verkeersruimte', true, (numEmployees: number, subtotalM3: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Verkeersruimte = 0.14m2 * ', subtotalM3, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return subtotalM3 ? Math.ceil(subtotalM3 * 0.14 * (window.Form?.officeLayout?.multiplier ?? 1)) : 0;
      }
      return 0;
    }, true),
    new Facility('Aanlandplekken', true, (numEmployees: number, subtotalM3: number, numWorkspaces: number): number => {
      if (numWorkspaces > 0) {
        console.log(' - Aanlandplekken = 0.5m2 * ', numWorkspaces, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return numWorkspaces ? Math.ceil(numWorkspaces * 0.5 * (window.Form?.officeLayout?.multiplier ?? 1)) : 0;
      }
      return 0;
    }),
    new Facility('Serverruimte', true, (numEmployees: number, subtotalM3: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Serverruimte = 0.01m2 * ', subtotalM3, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return subtotalM3 ? Math.ceil(subtotalM3 * 0.01 * (window.Form?.officeLayout?.multiplier ?? 1)) : 0;
      }
      return 0;
    }),
    new Facility('Kolfruimte', true, (numEmployees: number): number => {
      numEmployees = numEmployees <= 0 ? 1 : numEmployees;
      console.log(' - Kolfruimte = 5m2 * ', Math.ceil(numEmployees / 80), '*', (window.Form?.officeLayout?.multiplier ?? 1))
      return Math.ceil(5 * Math.ceil(numEmployees / 80) * (window.Form?.officeLayout?.multiplier ?? 1));
    }, true),
    new Facility('Bidruimte', true, (numEmployees: number): number => {
      numEmployees = numEmployees <= 0 ? 1 : numEmployees;
      console.log(' - Bidruimte = 6m2 * ', Math.ceil(numEmployees / 80), '*', (window.Form?.officeLayout?.multiplier ?? 1))
      return Math.ceil(6 * Math.ceil(numEmployees / 80) * (window.Form?.officeLayout?.multiplier ?? 1));
    }, true),
    new Facility('Toilets', true, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - Toilets = 5.5m2 * ', Math.ceil(numEmployees / 30), '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(5.5 * Math.ceil(numEmployees / 30) * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('MIVA', true, (numEmployees: number): number => {
      if (numEmployees > 0) {
        console.log(' - MIVA = 3.7m2 * ', Math.ceil(((numEmployees / 30) * 2) / 10), '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return Math.ceil(3.7 * Math.ceil(((numEmployees / 30) * 2) / 10) * (window.Form?.officeLayout?.multiplier ?? 1));
      }
      return 0;
    }),
    new Facility('Gridloss', true, (numEmployees: number, subtotalM3: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Gridloss = 0.1m2 * ', subtotalM3, '*', (window.Form?.officeLayout?.multiplier ?? 1))
        return subtotalM3 ? Math.ceil(subtotalM3 * 0.1 * (window.Form?.officeLayout?.multiplier ?? 1)) : 0;
      }
      return 0;
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

  list(): Facility[] {
    return this.defaults;
  }

  totalM2(numEmployees: number, subtotalM3: number, numWorkspaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(numEmployees, subtotalM3, numWorkspaces);
      }
    })
    return totalM2;
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: Facility, i: number): void => {
      const el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i], item.readonly);
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
  private readonly formField: HTMLDivElement;
  private defaults: ExtraRoom[] = [];

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);

    this.formField = Div.build(['form-field']);
    this.stack.append(this.formField);

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
        this.add(new ExtraRoom(this.inputName.value, parseInt(this.inputM2.value)));
        this.inputName.value = '';
        this.inputM2.value = '';
      }
    };
    extraRooms.append(this.formButton);
  }

  add(extraRoom: ExtraRoom): void {
    this.defaults.push(extraRoom);
    window.Output?.reset();
    window.Form?.init();
  }

  list(): ExtraRoom[] {
    return this.defaults;
  }

  hasActive(): boolean {
    let hasActive: boolean = false;
    this.defaults.forEach((extraRoom: ExtraRoom): void => {
      if (extraRoom.active) {
        hasActive = true;
      }
    });
    return hasActive;
  }

  totalM2(): number {
    let totalM2: number = 0;
    this.defaults.forEach((extraRoom: ExtraRoom): void => {
      if (extraRoom.active) {
        totalM2 += extraRoom.callbackFn();
      }
    });
    return totalM2;
  }


  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: ExtraRoom, i: number): void => {
      const el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i]);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let active: boolean = target.checked;
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].active = active;
        window.Output?.reset();
        window.Form?.init();
      };
      this.formField.append(el);
    });
    return this.stack;
  }
}