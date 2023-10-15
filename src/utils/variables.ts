import {CheckboxLabel, Div, Input} from "$utils/html";
import {
  ExtraRoom,
  Facility,
  fraction,
  getIndex,
  m2Sup,
  MeetingRoom,
  parseIntOrZero,
  ratio,
  TooltipIcon
} from "$utils/helpers";
import {
  InputFormField,
  MetrageInputGroup,
  MetrageInputHeaderRow,
  MetrageInputItem,
  MetrageStatsInputGroup
} from "$utils/factory";

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

  get totalDepartmentPeople(): number {
    return this.numWorkstations + this.numCEORooms + this.num1PersonRooms
      + (this.num2PersonRooms * 2) + (this.num4PersonRooms * 4)
      + (this.num6PersonRooms * 6);
  }

  get totalDepartmentWorkstations(): number {
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
}

export class GeneralLayout {
  private readonly group: HTMLDivElement;
  private readonly inputOrganisationName: InputFormField;
  private officeLayout: HTMLElement | null | undefined;
  private readonly inputExpectedGrowth: InputFormField;
  private readonly inputNumEmployees: InputFormField;
  private _organisationName: string = '';
  private _numEmployees: number = 0;
  private _expectedGrowth: number = 0;

  constructor() {
    this.group = MetrageInputGroup.build();
    this.group.append(MetrageInputHeaderRow.build('Algemeen'));

    this.inputOrganisationName = new InputFormField();
    this.inputNumEmployees = new InputFormField(null, '0');
    this.inputExpectedGrowth = new InputFormField(null, '0');
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
    this.group.append(this.inputOrganisationName.build('Organisatie'));
    this.group.append(this.inputNumEmployees.build('Aantal medewerkers', 'Headcount totaal aantal medewerkers ongeacht fulltime/parttime'));
    this.group.append(this.inputExpectedGrowth.build('Verwachte groei % in 5 jaar', 'Verwacht groeipercentage in totaal aantal medewerkers'));

    if (this.officeLayout) {
      let oldOfficeLayoutStack: HTMLElement | null = this.officeLayout.parentElement;
      this.group.append(this.officeLayout);
      oldOfficeLayoutStack?.remove();
    }

    // Add Events
    this.inputOrganisationName.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this._organisationName = e.target.value.trim();
      // @ts-ignore
      window.Output.reset();
    });
    this.inputNumEmployees.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this._numEmployees = parseIntOrZero(e.target.value);
      // @ts-ignore
      window.Output.reset();
    });
    this.inputExpectedGrowth.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this._expectedGrowth = parseIntOrZero(e.target.value);
      // @ts-ignore
      window.Output.reset();
    });

    return this.group;
  }
}

export class WorkLayout {
  private readonly group: HTMLDivElement;
  private departmentTab: Element | null | undefined;

  constructor() {
    this.group = MetrageInputGroup.build();
    this.group.append(
      MetrageInputHeaderRow.build(
        'Werken',
        'Kies voor ‘Globaal’ voor de invoer van data voor de totale organisatie óf ‘Per afdeling’ voor een uitsplitsing per afdeling'
      ));
  }

  public addDepartmentTab(departmentTag: Element | null | undefined): void {
    this.departmentTab = departmentTag;
  }

  build(): HTMLDivElement {
    if (this.departmentTab)
      this.group.append(this.departmentTab);

    return this.group;
  }
}

export class ExtraPlacesLayout {
  private readonly group: HTMLDivElement;

  infoTotalWorkplaces: HTMLDivElement;

  inputExtraPlaces: InputFormField;

  extraPlaces: number = 0;

  constructor() {
    this.group = MetrageInputGroup.build();
    this.infoTotalWorkplaces = MetrageStatsInputGroup.build();
    this.inputExtraPlaces = new InputFormField(null, '0');
  }

  build(): HTMLDivElement {
    this.group.append(this.infoTotalWorkplaces);
    this.group.append(this.inputExtraPlaces.build('Aantal aanlandplekken'))

    this.inputExtraPlaces.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.extraPlaces = parseIntOrZero(e.target.value);
      // @ts-ignore
      window.Output.reset();
      this.updateInfoBoxes();
    });
    this.updateInfoBoxes();

    return this.group;
  }

  extraPlacesM2(): number {
    if (this.extraPlaces > 0) {
      console.log(' -', this.extraPlaces, 'Aanlandplekken * 2 m² *', window.Form?.officeLayout?.multiplier);
      // @ts-ignore
      return Math.ceil(this.extraPlaces * 2 * window.Form?.officeLayout?.multiplier);
    }
    return 0;
  }

  updateInfoBoxes(): void {
    const numWorkplaces: number = window.Output?.getTotalDepartmentWorkstations() ?? 0;
    let numEmployees: number = window.Form?.generalLayout?.numEmployees ?? 0;
    const tooltip: string = 'De werkplekratio geeft weer hoeveel vaste werkplekken er beschikbaar zijn ten opzichte van het totaal aantal medewerkers. Dit kan als leidraad dienen voor het gewenst aantal aanlandplekken bij de volgende vraag.'

    this.infoTotalWorkplaces.innerHTML = '';
    this.infoTotalWorkplaces.append(MetrageInputItem.build('Totaal aantal vaste werkplekken:', numWorkplaces));
    this.infoTotalWorkplaces.append(MetrageInputItem.build('Werkplek ratio:', ratio(numWorkplaces, numEmployees), null, tooltip));
  }
}

export class MeetingSpaceLayout {
  private readonly group: HTMLDivElement;
  private readonly formField: HTMLDivElement;
  private readonly infoCallRatio: HTMLDivElement;
  private readonly infoTotalMeetingChairs: HTMLDivElement;

  private num1PCallPlaces: MeetingRoom = new MeetingRoom('Aantal 1p belplekken', (amount: number): number => {
      if (amount > 0) {
        console.log(' - Aantal belplekken = ', amount, '* 2.5 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 2.5 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount;
    }, '1p belplek: 2.5m². Gemiddeld wordt er in kantoren 1 belplek per 6 werkplekken voorzien'
  );

  // Default MeetingRooms
  private defaults: MeetingRoom[] = [
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
        console.log(' - 50-people conference = ', amount, '* 50 m² *', window.Form?.officeLayout?.multiplier);
        // @ts-ignore
        return Math.ceil(amount * 50 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, (amount: number): number => {
      return amount * 50;
    }, 'Vergaderruimte tot 50p: 50m²'),
  ];

  constructor() {
    this.group = MetrageInputGroup.build();
    this.group.append(MetrageInputHeaderRow.build('Vergaderen'));

    this.group.append(this.buildInput(this.num1PCallPlaces, 999));
    this.infoCallRatio = MetrageStatsInputGroup.build();
    this.group.append(this.infoCallRatio);

    this.formField = Div.build(['form-field']);
    this.group.append(this.formField);

    this.infoTotalMeetingChairs = MetrageStatsInputGroup.build();
    this.group.append(this.infoTotalMeetingChairs);
  }

  list(): MeetingRoom[] {
    return this.defaults;
  }

  totalM2(): number {
    let totalM2: number = this.num1PCallPlaces.callbackFn(this.num1PCallPlaces.amount);
    this.defaults.forEach((room: MeetingRoom): void => {
      if (room.amount > 0) {
        totalM2 += room.callbackFn(room.amount);
      }
    })
    return totalM2;
  }

  num1pCallPlaces(): number {
    return this.num1PCallPlaces.callbackForPeople(this.num1PCallPlaces.amount);
  }

  build(): HTMLDivElement {
    this.formField.innerHTML = '';
    this.defaults.forEach((item: MeetingRoom, i: number): void => {
      this.formField.append(this.buildInput(item, i));
    });
    this.updateInfoBoxes();

    return this.group;
  }

  buildInput(item: MeetingRoom, i: number): HTMLDivElement {
    const el: HTMLDivElement = new InputFormField(['index-' + i], '0').build(item.name, item.tooltip);
    el.onkeyup = (e: Event): void => {
      let target: HTMLInputElement = e.target as HTMLInputElement;
      item.amount = parseIntOrZero(target.value);
      window.Output?.reset();
      this.updateInfoBoxes();
    };
    return el;
  }

  updateInfoBoxes(): void {
    let num1pCallPlaces: number = this.num1pCallPlaces();
    let numWorkplaces: number = window.Output?.getTotalDepartmentWorkstations() ?? 0;
    let numExtraPlaces: number = window.Form?.extraPlacesLayout.extraPlaces ?? 0;
    this.infoCallRatio.innerHTML = '';
    this.infoCallRatio.append(MetrageInputItem.build('Belplekratio:', fraction(num1pCallPlaces, numWorkplaces + numExtraPlaces)));

    let totalChairs: number = 0;
    this.defaults.forEach((item: MeetingRoom): void => {
      totalChairs += item.callbackForPeople(item.amount);
    });
    this.infoTotalMeetingChairs.innerHTML = '';
    this.infoTotalMeetingChairs.append(MetrageInputItem.build('Totaal aantal vergaderplekken: ',
      totalChairs,
      '',
      'Totaal aantal vergaderstoelen op basis van de maximale bezetting')
    );
  }
}

export class FacilitiesLayout {
  private readonly group: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default Facilities
  private defaults: Facility[] = [
    new Facility('Toiletten', true, (subtotalM3: number, numWorkstations: number, numExtraPlaces: number): number => {
      if ((numWorkstations + numExtraPlaces) > 0) {
        console.log(' - Toiletten = 5.5m² *', (1 + Math.floor((numWorkstations + numExtraPlaces) / 26)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(5.5 * (1 + Math.floor((numWorkstations + numExtraPlaces) / 26)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Verplichte voorziening conform ARBO norm: 2 toiletten per 30 personen'),

    new Facility('MIVA', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - MIVA = 3.7m² *', (1 + Math.floor(((numWorkstations / 26) * 2) / 10)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(3.7 * (1 + Math.floor(((numWorkstations / 26) * 2) / 10)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Mindervalide toilet: verplichte individuele voorziening conform de ARBO norm, tenzij deze in een verzamelgebouw als algemene voorziening aanwezig is'),

    new Facility('Kolfruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Kolfruimte = 5m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(5 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Verplichte voorziening conform ARBO norm'),

    new Facility('Bidruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Bidruimte = 6m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(6 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Verplichte voorziening conform ARBO norm'),

    new Facility('Garderobe', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Garderobe = 0.05m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.05 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Repro', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Repro = 0.2m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.2 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Serverruimte', false, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Serverruimte = 6m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(6 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Opslagruimte', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Opslagruimte = 20m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(20 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false),

    new Facility('Schoonmaakhok', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Schoonmaakhok = 6m² *', 1 + (Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(6 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false),

    new Facility('Bemande receptie', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Bemande receptie = 30m² * ', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(30 * window.Form?.officeLayout?.multiplier);
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

    new Facility('Pantry / Koffiecorner', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Pantry / Koffiecorner = 15m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(15 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
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
        console.log(' - Lounge = 15m² *', (1 + Math.floor(numWorkstations / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(15 * (1 + Math.floor(numWorkstations / 51)) * window.Form?.officeLayout?.multiplier);
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

    new Facility('Gym', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Gym = 50m² *', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(50 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

    new Facility('Douches', false, (subtotalM3: number, numWorkstations: number, numExtraPlaces: number): number => {
      if ((numWorkstations + numExtraPlaces) > 0) {
        console.log(' - Douches = 10m² *', 1 + (Math.floor((numWorkstations + numExtraPlaces) / 51)), '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(10 * (1 + Math.floor((numWorkstations + numExtraPlaces) / 51)) * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }, false, 'Douches 10m2 per 50 personen voorzien voor m/v/x'),

    new Facility('Lockers', false, (subtotalM3: number, numWorkstations: number): number => {
      if (numWorkstations > 0) {
        console.log(' - Lockers = 0.05m² *', numWorkstations, '*', window.Form?.officeLayout?.multiplier)
        // @ts-ignore
        return Math.ceil(numWorkstations * 0.05 * window.Form?.officeLayout?.multiplier);
      }
      return 0;
    }),

  ];

  constructor() {
    this.group = MetrageInputGroup.build();
    this.group.append(MetrageInputHeaderRow.build('Faciliteiten'));
    this.formField = Div.build(['form-field']);
    this.group.append(this.formField);
  }

  list(): Facility[] {
    return this.defaults;
  }

  totalM2(subtotalM3: number, numWorkspaces: number, numExtraPlaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(subtotalM3, numWorkspaces, numExtraPlaces);
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
        let tooltip: HTMLElement = TooltipIcon(item.tooltip);
        el.append(tooltip);
      }
      this.formField.append(el);
    });

    return this.group;
  }
}

export class OtherRoomsLayout {
  private name: string = 'Overige';
  private readonly stack: HTMLDivElement;
  private readonly formField: HTMLDivElement;

  // Default OtherRooms
  private defaults: Facility[] = [
    new Facility('Verkeersruimte', true, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Verkeersruimte = 15% *', subtotalM3)
        // @ts-ignore
        return subtotalM3 ? Math.ceil(subtotalM3 * 0.15) : 0;
      }
      return 0;
    }, true, '15% x totaal m²: verkeersruimte omvat loopruimte, trappen, gangen, liften en dergelijke'),

    new Facility('Gridloss', true, (subtotalM3: number, numWorkstations: number): number => {
      if (subtotalM3 > 0) {
        console.log(' - Gridloss = 5% *', subtotalM3)
        // @ts-ignore
        return Math.ceil(subtotalM3 * 0.05);
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

  totalM2(subtotalM3: number, numWorkspaces: number, numExtraPlaces: number): number {
    let totalM2: number = 0;
    this.defaults.forEach((facility: Facility): void => {
      if (facility.active) {
        totalM2 += facility.callbackFn(subtotalM3, numWorkspaces, numExtraPlaces);
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
        let tooltip: HTMLElement = TooltipIcon(item.tooltip);
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
  private readonly checkboxStack:HTMLDivElement;
  private readonly inputName: HTMLInputElement;
  private readonly inputM2: HTMLInputElement;
  private readonly formButton: HTMLAnchorElement;

  private defaults: ExtraRoom[] = [];

  constructor() {
    this.stack = Div.build(['stack']);
    let heading: HTMLDivElement = MetrageInputHeaderRow.build(this.name,'Voeg hier indien gewenst een extra ruimte toe met daarbij de benodigde m²');
    this.stack.append(heading);

    this.checkboxStack = Div.build(['metrage_extra-room', 'checkboxes']);
    this.stack.append(this.checkboxStack);
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
        let value: number = parseInt(this.inputM2.value);
        this.defaults.push(new ExtraRoom(this.inputName.value, value));
        this.inputName.value = '';
        this.inputM2.value = '';
        this.rebuildCheckboxes();
        window.Output?.reset();
      }
    };
    extraRooms.append(this.formButton);
    this.rebuildCheckboxes();
  }

  list(): ExtraRoom[] {
    return this.defaults;
  }

  totalM2(): number {
    let totalM2: number = 0;
    this.defaults.forEach((extraRoom: ExtraRoom): void => {
      if (extraRoom.active) {
        totalM2 += extraRoom.callbackFn();
      }
    })
    return totalM2;
  }

  rebuildCheckboxes():void {
    this.defaults.forEach((item: ExtraRoom, i: number): void => {
      let el: HTMLLabelElement = CheckboxLabel.build(item.name + ' ('+item.m2+m2Sup()+')', '1', item.active, ['index-' + i]);
      el.onchange = (e: Event): void => {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let active: boolean = target.checked;
        let index: number = getIndex(el.classList.toString().split(' '));
        this.defaults[index].active = active;
        window.Output?.reset();
      };
      this.checkboxStack.append(el);
    });
  }

  build(): HTMLDivElement {
    return this.stack;
  }
}