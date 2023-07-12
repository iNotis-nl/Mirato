import {InputFormField} from "$utils/factory";
import {DepartmentLayout} from "$utils/variables";
import {parseIntOrZero} from "$utils/helpers";
import {Div} from "$utils/html";

export class Department {
  departmentBody: HTMLDivElement;
  currentStack: HTMLDivElement;

  inputNumEmployees: InputFormField;
  inputExpectedGrowth: InputFormField;
  inputNumWorkstations: InputFormField;
  inputNumCEORooms: InputFormField;
  inputNum1PersonRooms: InputFormField;
  inputNum2PersonRooms: InputFormField;
  inputNum4PersonRooms: InputFormField;
  inputNum6PersonRooms: InputFormField;

  departmentLayout: DepartmentLayout;

  constructor() {
    this.departmentLayout = new DepartmentLayout();
    this.departmentBody = Div.build([]);
    this.currentStack = Div.build([]);
    this.inputNumEmployees = new InputFormField();
    this.inputExpectedGrowth = new InputFormField();
    this.inputNumWorkstations = new InputFormField();
    this.inputNumCEORooms = new InputFormField();
    this.inputNum1PersonRooms = new InputFormField();
    this.inputNum2PersonRooms = new InputFormField();
    this.inputNum4PersonRooms = new InputFormField();
    this.inputNum6PersonRooms = new InputFormField();
  }

  build() {
    this.departmentBody.innerHTML = '';
    this.createNewStack();
    this.currentStack.append(this.inputNumEmployees.build('Aantal medewerkers', 'Dit zijn het aantal medewerkers op deze afdeling'));
    this.currentStack.append(this.inputExpectedGrowth.build('Verwachte groei % in 5 jaar'));
    this.currentStack.append(this.inputNumWorkstations.build('Aantal werkplekken'));

    this.createNewStack('Afsluitbare kantoren');
    this.currentStack.append(this.inputNumCEORooms.build('Aantal directie ruimtes', 'We zien dat kantoren voor directie vaak ruimer opgezet worden. Is dit niet nodig selecteer dan het aantal kantoren bij de volgende vraag.'));
    this.currentStack.append(this.inputNum1PersonRooms.build('Aantal kantoren voor 1 persoon'));
    this.currentStack.append(this.inputNum2PersonRooms.build('Aantal kantoren voor 2 personen'));
    this.currentStack.append(this.inputNum4PersonRooms.build('Aantal kantoren voor 4 personen'));
    this.currentStack.append(this.inputNum6PersonRooms.build('Aantal kantoren voor 6 personen'));

    // Add Events for all Inputs
    this.inputNumEmployees.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.numEmployees = parseIntOrZero(e.target.value);
    });
    this.inputExpectedGrowth.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.expectedGrowth = parseIntOrZero(e.target.value);
    });
    this.inputNumWorkstations.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.numWorkstations = parseIntOrZero(e.target.value);
    });

    this.inputNumCEORooms.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.numCEORooms = parseIntOrZero(e.target.value);
    });
    this.inputNum1PersonRooms.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.num1PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum2PersonRooms.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.num2PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum4PersonRooms.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.num4PersonRooms = parseIntOrZero(e.target.value);
    });
    this.inputNum6PersonRooms.addEventListener('keyup', (e: KeyboardEvent) => {
      // @ts-ignore
      this.departmentLayout.num6PersonRooms = parseIntOrZero(e.target.value);
    });

    [
      this.inputNumEmployees, this.inputExpectedGrowth, this.inputNumWorkstations,
      this.inputNumCEORooms, this.inputNum1PersonRooms, this.inputNum2PersonRooms, this.inputNum4PersonRooms, this.inputNum6PersonRooms
    ].forEach((i: InputFormField) => {
      i.addEventListener('keyup', () => {
        // @ts-ignore
        window.Output.reset();
      });
    });

    return this.departmentBody;
  }

  createNewStack(title: string | null = null) {
    this.currentStack = Div.build(['stack']);
    this.departmentBody.append(this.currentStack);
    if (title) {
      const titleDiv = Div.build(['heading-small', 'is-metrage']);
      titleDiv.innerHTML = title;
      this.currentStack.append(titleDiv);
    }
  }

}
