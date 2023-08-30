import {CheckboxLabel, Div, Input} from "$utils/html";
import {ExtraRoom, Facility, getIndex, MeetingRoom, parseIntOrZero, TooltipIcon} from "$utils/helpers";
import {InputFormField} from "$utils/factory";

/**
 * List of Constants used in the tool to calculate the m² needed
 */
export const MODE_DEPARTMENT: string = 'department';
export const MODE_GLOBAL: string = 'global';


export class OfficeLayout {
  type: string = 'LayoutBasic';
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
  numWorkstations: number = 0;
  numCEORooms: number = 0;
  num1PersonRooms: number = 0;
  num2PersonRooms: number = 0;
  num4PersonRooms: number = 0;
  num6PersonRooms: number = 0;
  extraSpaces: number = 0;

  get totalDepartmentM2(): number {
    return this.numWorkstationsM2 + this.totalPersonsRoomsM2;
  }

  get totalDepartmentPeople(): number {
    return this.numWorkstations + this.numCEORooms + this.num1PersonRooms
      + (this.num2PersonRooms * 2) + (this.num4PersonRooms * 4)
      + (this.num6PersonRooms * 6);
  }

  get totalDepartmentNumber(): number {
    return this.numWorkstations + this.numCEORooms + this.num1PersonRooms
      + this.num2PersonRooms + this.num4PersonRooms
      + this.num6PersonRooms;
  }

  get numWorkstationsM2(): number {
    if (this.numWorkstations > 0) {
      console.log(' -', this.numWorkstations, 'Workstations * 6 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.numWorkstations * 6 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get numCEORoomsM2(): number {
    if (this.numCEORooms > 0) {
      console.log(' -', this.numCEORooms, 'Workstations * 20 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.numCEORooms * 20 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get num1PersonRoomsM2(): number {
    if (this.num1PersonRooms > 0) {
      console.log(' -', this.num1PersonRooms, '1-person room * 12 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.num1PersonRooms * 12 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get num2PersonRoomsM2(): number {
    if (this.num2PersonRooms > 0) {
      console.log(' -', this.num2PersonRooms, '2-person room * 14 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.num2PersonRooms * 14 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get num4PersonRoomsM2(): number {
    if (this.num4PersonRooms > 0) {
      console.log(' -', this.num4PersonRooms, '4-person room * 22 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.num4PersonRooms * 22 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get num6PersonRoomsM2(): number {
    if (this.num6PersonRooms > 0) {
      console.log(' -', this.num6PersonRooms, '6-person room * 30 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.num6PersonRooms * 30 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  get numExtraSpacesM2(): number {
    if (this.extraSpaces > 0) {
      console.log(' -', this.extraSpaces, 'aanlandplekken * 2 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.extraSpaces * 2 * window.Form?.officeLayout?.multiplier);
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

export class GeneralLayout {
  private name: string = 'Algemeen';
  private readonly stack: HTMLDivElement;
  private readonly inputOrganisationName: InputFormField;
  private officeLayout: HTMLElement | null | undefined;
  private readonly inputExpectedGrowth: InputFormField;
  private readonly inputNumEmployees: InputFormField;
  private _organisationName: string = '';
  private _numEmployees: number = 0;
  private _expectedGrowth: number = 0;


  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);

    this.inputOrganisationName = new InputFormField();
    this.inputExpectedGrowth = new InputFormField();
    this.inputNumEmployees = new InputFormField();
  }

  addOfficeLayout(officeLayout: HTMLElement | null | undefined): void {
    this.officeLayout = officeLayout;
  }

  get organisationName(): string {
    return this._organisationName;
  }

  get numEmployees(): number {
    return this._numEmployees;
  }

  get expectedGrowth(): number {
    return this._expectedGrowth;
  }

  build(): HTMLDivElement {
    this.stack.append(this.inputOrganisationName.build('Organisatie'));
    this.stack.append(this.inputNumEmployees.build('Aantal medewerkers', 'Headcount totaal aantal medewerkers ongeacht fulltime/parttime'));
    this.stack.append(this.inputExpectedGrowth.build('Verwachte groei % in 5 jaar', 'Verwacht groeipercentage in totaal aantal medewerkers'));

    if (this.officeLayout) {
      let oldOfficeLayoutStack: HTMLElement | null = this.officeLayout.parentElement;
      this.stack.append(this.officeLayout);
      oldOfficeLayoutStack?.remove();
    }

    // Add Events
    this.inputOrganisationName.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this._organisationName = e.target.value.trim();
      // @ts-ignore
      window.Output.reset();
    });
    this.inputNumEmployees.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this._numEmployees = parseIntOrZero(e.target.value);
      // @ts-ignore
      window.Output.reset();
    });
    this.inputExpectedGrowth.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this._expectedGrowth = parseIntOrZero(e.target.value);
      // @ts-ignore
      window.Output.reset();
    });

    return this.stack;
  }
}

export class WorkLayout {
  private name: string = 'Werken';
  private readonly stack: HTMLDivElement;
  private departmentTab: Element | null | undefined;

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    let tooltip: HTMLImageElement = TooltipIcon('Kies voor ‘Globaal’ voor de invoer van data voor de totale organisatie óf ‘Per afdeling’ voor een uitsplitsing per afdeling');
    heading.append(tooltip);
    this.stack.append(heading);
  }

  public addDepartmentTab(departmentTag: Element | null | undefined): void {
    this.departmentTab = departmentTag;
  }

  build(): HTMLDivElement {
    if (this.departmentTab)
      this.stack.append(this.departmentTab);

    return this.stack;
  }
}

export class MeetingSpaceLayout {
  private name: string = 'Vergaderen';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;
  private readonly infoTotalMeetingChairs: HTMLDivElement;

  // Default MeetingRooms
  private defaults: MeetingRoom[] = [
    new MeetingRoom('Aantal 1p belplekken', (amount: number): number => {
        if (amount > 0) {
          console.log(' - Aantal belplekken = ', amount, '* 4 m² *', window.Form?.officeLayout?.multiplier);
          // @ts-ignore
          return Math.ceil(amount * 4 * window.Form?.officeLayout?.multiplier);
        }
        return 0;
      }, (amount: number): number => {
        return amount;
      }, '1p belplek: 4m². Gemiddeld wordt er in kantoren 1 belplek per 6 werkplekken voorzien'
    ),

    new MeetingRoom('Aantal 1-2p focus rooms', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 1-2p focus room = ', amount, '* 7 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 8 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 2;
    }, '1-2p focus room: 7m²'),

    new MeetingRoom('Aantal 2-4p vergaderruimtes', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 2-people conference = ', amount, '* 8 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 8 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 4;
    }, ' 2-4p vergaderruimte: 8m²'),

    new MeetingRoom('Aantal 6-8p vergaderruimtes', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 6-people conference = ', amount, '* 20 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 20 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 8;
    }, '6-8p vergaderruimte: 20m²'),

    new MeetingRoom('Aantal 10-20p vergaderruimtes', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 10-people conference = ', amount, '* 30 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 30 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 20;
    }, '10-20p vergaderruimte: 30m²'),

    new MeetingRoom('Aantal vergaderruimtes tot 50p', (amount: number): number => {
      if (amount > 0) {
        console.log(' - 50-people conference = ', amount, '* 20 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 50 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 50;
    }, 'Vergaderruimte tot 50p: 50m²'),
  ];

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);
    this.formField = Div.build(['form-field']);
    this.stack.append(this.formField);
    this.infoTotalMeetingChairs = Div.build(['info']);
    this.stack.append(this.infoTotalMeetingChairs);
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
      const el: HTMLDivElement = new InputFormField(['index-' + i]).build(item.name, item.tooltip);
      el.onkeyup = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let amount: number = parseIntOrZero(target.value);
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].amount = amount;
        window.Output?.reset();
        this.updateMeetingChairs();
      };
      this.formField.append(el);
    });
    this.updateMeetingChairs();

    return this.stack;
  }

  updateMeetingChairs(): void {
    let totalChairs: number = 0;
    this.defaults.forEach((item: MeetingRoom, i: number): void => {
      totalChairs += item.callbackForPeople(item.amount);
    });
    this.infoTotalMeetingChairs.innerHTML = 'Totaal aantal vergaderplekken: ' + totalChairs;
    this.infoTotalMeetingChairs.append(TooltipIcon('Totaal aantal vergaderstoelen op basis van de maximale bezetting'));
  }
}

export class FacilitiesLayout {
  private name: string = 'Faciliteiten';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default Facilities
  private defaults: Facility[] = [
    new Facility('Bemande receptie', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Bemande receptie = 30m² * ', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(30 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Garderobe', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Garderobe = 0.05m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.05 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Lockers', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Lockers = 0.05m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.05 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Repro', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Repro = 0.2m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.2 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Serverruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Serverruimte = 6m² *', (1 + Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Pantry / Koffiecorner', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Pantry / Koffiecorner = 15m² *', (1 + Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(15 * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Lunchruimte', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Lunchruimte = 3m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 3 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Grootkeuken', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Grootkeuken = 30m² *', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(30 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Lounge', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Lounge = 15m² *', (1 + Math.floor(numWorkstations / 100)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(15 * (1 + Math.floor(numWorkstations / 100)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Gym', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Gym = 50m² *', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(50 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Game/Funruimte', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Game/Funruimte = 40m² *', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(40 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Kolfruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Kolfruimte = 5m² *', (1 + Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(5 * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true, 'Verplichte voorziening conform ARBO norm'),

    new Facility('Bidruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Bidruimte = 6m² *', (1 + Math.floor(numWorkstations / 80)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(6 * (1 + Math.floor(numWorkstations / 80)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true, 'Verplichte voorziening conform ARBO norm'),

    new Facility('Opslagruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Opslagruimte = 20m² *', (1 + Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(20 * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true),

    new Facility('Schoonmaakhok', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Schoonmaakhok = 6m² *', 1 + (Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(6 * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true),

    new Facility('Douches', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Douches = 10m² *', 1 + (Math.floor(numWorkstations / 50)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(10 * (1 + Math.floor(numWorkstations / 50)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true, 'Douches 10m2 per 50 personen voorzien voor m/v/x'),

    new Facility('Toiletten', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Toiletten = 5.5m² *', (1 + Math.floor(numWorkstations / 25)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(5.5 * (1 + Math.floor(numWorkstations / 25)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Verplichte voorziening conform ARBO norm: 2 toiletten per 30 personen'),

    new Facility('MIVA', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - MIVA = 3.7m² *', (1 + Math.floor(((numWorkstations / 25) * 2) / 10)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(3.7 * (1 + Math.floor(((numWorkstations / 25) * 2) / 10)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Mindervalide toilet: verplichte individuele voorziening conform de ARBO norm, tenzij deze in een verzamelgebouw als algemene voorziening aanwezig is'),

  ];

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = Div.build(['heading-small']);
    heading.innerText = this.name;
    this.stack.append(heading);
    this.formField = Div.build(['form-field']);
    this.stack.append(this.formField);
  }

  add(extraRoom: Facility): void {
    this.defaults.push(extraRoom);
    window.Output?.reset();
    window.Form?.init();
  }

  list(): Facility[] {
    return this.defaults;
  }

  totalM2(subtotalM3: number, numWorkspaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(subtotalM3, numWorkspaces);
      }
    })
    return totalM2;
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: Facility, i: number): void => {
      let el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i], item.readonly);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let active: boolean = target.checked;
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].active = active;
        window.Output?.reset();
      };
      if (item.tooltip) {
        let tooltip: HTMLImageElement = TooltipIcon(item.tooltip);
        el.append(tooltip);
      }
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
    new Facility('Verkeersruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Verkeersruimte = 15% * ', subtotalM3, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return subtotalM3 ? Math.ceil(subtotalM3 * 0.15 * window.Form?.officeLayout?.multiplier) : 0;
      }
      return 0;
    }, true, '15% x totaal m²: verkeersruimte omvat loopruimte, trappen, gangen, liften en dergelijke'),

    new Facility('Gridloss', true, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Gridloss = 5% * ', subtotalM3, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(subtotalM3 * 0.05 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, true, '5% x totaal m²: verlies op basis van stramienmaten en incourant vloeroppervlak'),
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

  totalM2(subtotalM3: number, numWorkspaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(subtotalM3, numWorkspaces);
      }
    })
    return totalM2;
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: Facility, i: number): void => {
      let el: HTMLLabelElement = CheckboxLabel.build(item.name, '1', item.active, ['index-' + i], item.readonly);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let active: boolean = target.checked;
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].active = active;
        window.Output?.reset();
      };
      if (item.tooltip) {
        let tooltip: HTMLImageElement = TooltipIcon(item.tooltip);
        el.append(tooltip);
      }
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
    let tooltip: HTMLImageElement = TooltipIcon('Voeg hier indien gewenst een faciliteit toe met daarbij de benodigde m²');
    heading.append(tooltip);
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
    this.formButton.onclick = (): void => {
      if (this.inputName.value !== '' && this.inputM2.value !== '') {
        let label: string = this.inputName.value + ' (' + parseInt(this.inputM2.value) + 'm²)';
        let value: number = parseInt(this.inputM2.value);
        window.Form?.facilitiesLayout.add(new Facility(label, true, () => {
          return value;
        }));
        this.inputName.value = '';
        this.inputM2.value = '';
      }
    };
    extraRooms.append(this.formButton);
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