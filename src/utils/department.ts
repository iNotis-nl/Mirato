import {InputFormField, MetrageInputSubHeaderRow} from "$utils/factory";
import {DepartmentLayout} from "$utils/variables";
import {createId, parseIntOrZero} from "$utils/helpers";
import {Div} from "$utils/html";

export class Department {
  id: string;
  departmentBody: HTMLDivElement;
  currentStack: HTMLDivElement;

  inputNumWorkstations: InputFormField;
  inputNumCEORooms: InputFormField;
  inputNum1PersonRooms: InputFormField;
  inputNum2PersonRooms: InputFormField;
  inputNum4PersonRooms: InputFormField;
  inputNum6PersonRooms: InputFormField;

  departmentLayout: DepartmentLayout;

  constructor() {
    this.id = createId('department');
    this.departmentLayout = new DepartmentLayout();
    this.departmentBody = Div.build([]);
    this.currentStack = Div.build([]);
    this.inputNumWorkstations = new InputFormField(null, '0');
    this.inputNumCEORooms = new InputFormField(null, '0');
    this.inputNum1PersonRooms = new InputFormField(null, '0');
    this.inputNum2PersonRooms = new InputFormField(null, '0');
    this.inputNum4PersonRooms = new InputFormField(null, '0');
    this.inputNum6PersonRooms = new InputFormField(null, '0');
  }

  build(): HTMLDivElement {
    this.departmentBody.innerHTML = '';
    this.createNewStack('Open werkplekken');
    this.currentStack.append(this.inputNumWorkstations.build('Aantal open werkplekken', '6m² per werkplek conform arbo norm. Door parttimers en hybride werken is de gemiddelde piekbelasting van organisaties circa 90% van het totaal aantal medewerkers.'));

    this.createNewStack('Aantal afgesloten werkplekken/ kantoren');
    this.currentStack.append(this.inputNumCEORooms.build('Aantal 1p directie kantoren', 'We zien dat kantoren voor directie vaak ruimer opgezet worden (20m²). Is dit niet nodig selecteer dan het aantal kantoren bij de volgende vraag.'));
    this.currentStack.append(this.inputNum1PersonRooms.build('Aantal 1p kantoren', 'Kantoor 1p: 12m²'));
    this.currentStack.append(this.inputNum2PersonRooms.build('Aantal 2p kantoren', 'Kantoor 2p: 14m²'));
    this.currentStack.append(this.inputNum4PersonRooms.build('Aantal 4p kantoren', 'Kantoor 4p: 22m²'));
    this.currentStack.append(this.inputNum6PersonRooms.build('Aantal 6p kantoren', 'Kantoor 6p: 30m²'));


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

    [
      this.inputNumWorkstations,
      this.inputNumCEORooms,
      this.inputNum1PersonRooms,
      this.inputNum2PersonRooms,
      this.inputNum4PersonRooms,
      this.inputNum6PersonRooms,
    ].forEach((i: InputFormField): void => {
      i.addEventListener('keyup', (): void => {
        // @ts-ignore
        window.Output.reset();
      });
    });

    return this.departmentBody;
  }

  createNewStack(title: string | null = null): void {
    this.currentStack = Div.build(['stack']);
    this.departmentBody.append(this.currentStack);
    if (title) {
      this.currentStack.append(MetrageInputSubHeaderRow.build(title));
    }
  }

}
