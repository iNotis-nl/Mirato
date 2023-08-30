import {InputFormField} from "$utils/factory";
import {DepartmentLayout} from "$utils/variables";
import {parseIntOrZero, ratio, TooltipIcon} from "$utils/helpers";
import {Div} from "$utils/html";

export class Department {
  departmentBody: HTMLDivElement;
  currentStack: HTMLDivElement;

  inputNumWorkstations: InputFormField;
  inputNumCEORooms: InputFormField;
  inputNum1PersonRooms: InputFormField;
  inputNum2PersonRooms: InputFormField;
  inputNum4PersonRooms: InputFormField;
  inputNum6PersonRooms: InputFormField;

  infoTotalWorkplaces: HTMLDivElement;

  inputExtraPlaces: InputFormField;

  departmentLayout: DepartmentLayout;

  constructor() {
    this.departmentLayout = new DepartmentLayout();
    this.departmentBody = Div.build([]);
    this.currentStack = Div.build([]);
    this.inputNumWorkstations = new InputFormField();
    this.inputNumCEORooms = new InputFormField();
    this.inputNum1PersonRooms = new InputFormField();
    this.inputNum2PersonRooms = new InputFormField();
    this.inputNum4PersonRooms = new InputFormField();
    this.inputNum6PersonRooms = new InputFormField();

    this.infoTotalWorkplaces = Div.build(['info']);

    this.inputExtraPlaces = new InputFormField();
  }

  build(): HTMLDivElement {
    this.departmentBody.innerHTML = '';
    this.createNewStack();
    this.currentStack.append(this.inputNumWorkstations.build('Aantal open werkplekken', '6m² per werkplek conform arbo norm. Door parttimers en hybride werken is de gemiddelde piekbelasting van organisaties circa 90% van het totaal aantal medewerkers.'));

    this.createNewStack('Aantal afgesloten werkplekken/ kantoren');
    this.currentStack.append(this.inputNumCEORooms.build('Directie kantoor', 'We zien dat kantoren voor directie vaak ruimer opgezet worden (20m²). Is dit niet nodig selecteer dan het aantal kantoren bij de volgende vraag.'));
    this.currentStack.append(this.inputNum1PersonRooms.build('Kantoren voor 1 persoon', 'Kantoor 1p: 12m²'));
    this.currentStack.append(this.inputNum2PersonRooms.build('Kantoren voor 2 personen', 'Kantoor 2p: 14m²'));
    this.currentStack.append(this.inputNum4PersonRooms.build('Kantoren voor 4 personen', 'Kantoor 4p: 22m²'));
    this.currentStack.append(this.inputNum6PersonRooms.build('Kantoren voor 6 personen', 'Kantoor 6p: 30m²'));

    this.currentStack.append(this.infoTotalWorkplaces);

    this.currentStack.append(this.inputExtraPlaces.build('Aanlandplekken'))

    // Add Events for all Inputs
    this.inputNumWorkstations.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.numWorkstations = parseIntOrZero(e.target.value);
    });
    this.inputNumCEORooms.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.numCEORooms = parseIntOrZero(e.target.value);
    });
    this.inputNum1PersonRooms.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.num1PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum2PersonRooms.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.num2PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum4PersonRooms.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.num4PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum6PersonRooms.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.num6PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputExtraPlaces.addEventListener('keyup', (e: KeyboardEvent): void => {
      // @ts-ignore
      this.departmentLayout.extraSpaces = parseIntOrZero(e.target.value);
    });

    [
      this.inputNumWorkstations,
      this.inputNumCEORooms,
      this.inputNum1PersonRooms,
      this.inputNum2PersonRooms,
      this.inputNum4PersonRooms,
      this.inputNum6PersonRooms,
      this.inputExtraPlaces
    ].forEach((i: InputFormField) => {
      i.addEventListener('keyup', () => {
        // @ts-ignore
        window.Output.reset();
        this.updateInfoBoxes();
      });
    });

    this.updateInfoBoxes();

    return this.departmentBody;
  }

  getNumWorkspaces(): number {
    return this.departmentLayout.numWorkstations +
      this.departmentLayout.numCEORooms +
      this.departmentLayout.num1PersonRooms +
      (this.departmentLayout.num2PersonRooms * 2) +
      (this.departmentLayout.num4PersonRooms * 4) +
      (this.departmentLayout.num6PersonRooms * 6);
  }

  getExtraSpaces(): number {
    return this.departmentLayout.extraSpaces;
  }

  getExtraSpacesM2(): number {
    return this.getExtraSpaces() * 2;
  }

  updateInfoBoxes(): void {
    const numWorkplaces: number = this.getNumWorkspaces();
    let numEmployees: number = window.Form?.generalLayout?.numEmployees ?? 0;
    this.infoTotalWorkplaces.innerHTML = 'Totaal aantal vaste werkplekken: ' + numWorkplaces + '<br>' +
      'Werkplekratio: ' + ratio(numWorkplaces,numEmployees);

    const tooltip: string = 'De werkplekratio geeft weer hoeveel vaste werkplekken er beschikbaar zijn ten opzichte van het totaal aantal medewerkers. Dit kan als leidraad dienen voor het gewenst aantal aanlandplekken bij de volgende vraag.'
    this.infoTotalWorkplaces.append(TooltipIcon(tooltip));
  }

  createNewStack(title: string | null = null): void {
    this.currentStack = Div.build(['stack']);
    this.departmentBody.append(this.currentStack);
    if (title) {
      const titleDiv: HTMLDivElement = Div.build(['heading-small', 'is-metrage']);
      titleDiv.innerHTML = title;
      this.currentStack.append(titleDiv);
    }
  }

}
