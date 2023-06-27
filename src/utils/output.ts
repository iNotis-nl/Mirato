import {DepartmentLayout, MODE_DEPARTMENT, MODE_GLOBAL} from '$utils/variables';
import {MetrageItemRow, MetrageStack} from "$utils/factory";
import {Div} from "$utils/html";
import type {Department} from "$utils/department";
import type {Faculty} from "$utils/helpers";


export class Output {

  private _mode: string = MODE_DEPARTMENT;
  private readonly formContent: HTMLDivElement;
  private readonly formButton: HTMLAnchorElement;
  private readonly outputStack: HTMLDivElement;

  constructor() {
    this.outputStack = document.getElementById('metrage-output') as HTMLDivElement;
    this.formContent = Div.build(['stack', 'gap-small'], {'id': 'tool-m2'});
    this.outputStack.innerHTML = '';
    this.outputStack.append(this.formContent);

    this.formButton = document.createElement('a');
    this.formButton.classList.add('button', 'w-button');
    this.formButton.text = 'Deel overzicht';
    this.formButton.onclick = () => {
      window.print();
    };
    this.outputStack.append(this.formButton);

    let placeholder: HTMLElement | null = document.getElementById('tool-m2_placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }

  set mode(value: string) {
    this._mode = value;
    this.reset();
  }

  reset() {
    console.log('Rebuilding the Output', this._mode);
    this.formContent.innerHTML = '';
    this.formContent.append(new MetrageItemRow('Metrage item', 'QTY', 'M<sup>2</sup>', 'header').build());
    let stack: HTMLDivElement = Div.build(['stack', 'gap-small']);
    const that = this;

    let numEmployees: number = 0;
    let subTotal: number = 0;
    let total: number = 0;
    let averageGrowth: number = 0;

    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;
      numEmployees = layout.numEmployees;
      // @ts-ignore
      subTotal += window.Form.globalDepartment.departmentLayout.totalDepartmentM2;
      // @ts-ignore
      total += window.Form.globalDepartment.departmentLayout.totalDepartmentM2WithGrowth;
      // @ts-ignore
      averageGrowth = window.Form.globalDepartment.departmentLayout.expectedGrowth;
      this.addMetrageList(stack, layout);
    } else if (this._mode === MODE_DEPARTMENT) {
      // @ts-ignore
      const departments: Department[] = window.Form.departments;
      departments.forEach(function (department: Department): void {
        numEmployees += department.departmentLayout.numEmployees;
        subTotal += department.departmentLayout.totalDepartmentM2;
        total += department.departmentLayout.totalDepartmentM2WithGrowth;
        averageGrowth += department.departmentLayout.expectedGrowth;

        stack.append(new MetrageItemRow(department.departmentLayout.name, '', department.departmentLayout.totalDepartmentM2, 'subheader', ['department']).build());
        that.addMetrageList(stack, department.departmentLayout);
      });
      averageGrowth /= departments.length;
    }

    stack.append(Div.build(['tool-m2_divider']));

    // @ts-ignore
    subTotal += window.Form?.facultiesLayout.totalM2(numEmployees);
    // @ts-ignore
    total += window.Form?.facultiesLayout.totalM2(Math.ceil(numEmployees * (1 + (averageGrowth / 100))));

    let facultiesStack: MetrageStack = new MetrageStack(
      // @ts-ignore
      new MetrageItemRow('Faciliteiten', '', window.Form?.facultiesLayout.totalM2(numEmployees), 'subheader')
    );
    let facultiesList: Faculty[] = window.Form?.facultiesLayout.list() ?? [];
    facultiesList.forEach((item: Faculty): void => {
      if (item.active) {
        facultiesStack.append(new MetrageItemRow(item.name, '', item.callbackFn(numEmployees)));
      }
    });

    stack.append(facultiesStack.build());
    stack.append(new MetrageStack(
      new MetrageItemRow('Overige', '', '0', 'subheader'),
      new MetrageItemRow('Loopruimte', '', '0'),
      new MetrageItemRow('Gridlos', '', '0'),
      new MetrageItemRow('Aanlandplekken', '', '0')
    ).build());

    stack.append(Div.build(['tool-m2_divider']));
    stack.append(new MetrageItemRow('Subtotaal', '', subTotal, 'header').build());


    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      stack.append(new MetrageItemRow(
        'Verwachte groei in 5 jaar',
        '',
        window.Form?.globalDepartment.departmentLayout.totalDepartmentM2WithGrowth,
        'subheader').build());
    } else if (this._mode === MODE_DEPARTMENT) {
      stack.append(new MetrageItemRow('Verwachte groei in 5 jaar', '', '', 'subheader').build());
      // @ts-ignore
      const departments: Department[] = window.Form.departments;
      departments.forEach(function (department: Department): void {
        stack.append(new MetrageItemRow(
          department.departmentLayout.name + ' <span>' + department.departmentLayout.expectedGrowth + '%</span>',
          '',
          department.departmentLayout.totalDepartmentM2WithGrowth).build()
        );
      });
    }
    stack.append(Div.build(['tool-m2_divider']));
    stack.append(new MetrageItemRow('Totaal', '', total, 'header').build());

    this.formContent.append(stack);
  }

  addMetrageList(stack: HTMLDivElement, layout: DepartmentLayout): void {
    stack.append(new MetrageStack(
      new MetrageItemRow('Medewerkers', layout.numEmployees, '', 'muted'),
      new MetrageItemRow('Werkplekken', layout.numWorkstations, layout.numWorkstationsM2),
    ).build());
    stack.append(new MetrageStack(
      new MetrageItemRow('Afsluitbare werkruimtes', '', layout.totalPersonsRoomsM2, 'subheader'),
      new MetrageItemRow('Directie ruimtes', layout.numCEORooms, layout.numCEORoomsM2),
      new MetrageItemRow('Kantoren - 1 persoon', layout.num1PersonRooms, layout.num1PersonRoomsM2),
      new MetrageItemRow('Kantoren - 2 personen', layout.num2PersonRooms, layout.num2PersonRoomsM2),
      new MetrageItemRow('Kantoren - 4 personen', layout.num4PersonRooms, layout.num4PersonRoomsM2),
      new MetrageItemRow('Kantoren - 6 personen', layout.num6PersonRooms, layout.num6PersonRoomsM2),
    ).build());
    stack.append(new MetrageStack(
      new MetrageItemRow('Overlegruimtes', '', layout.totalPersonConferenceRoomsM2, 'subheader'),
      new MetrageItemRow('Belplekken', layout.numCallRooms, layout.numCallRoomsM2),
      new MetrageItemRow('Overlegruimtes - 2-4 persoon', layout.num2PersonConferenceRooms, layout.num2PersonConferenceRoomsM2),
      new MetrageItemRow('Overlegruimtes - 6-8 personen', layout.num6PersonConferenceRooms, layout.num6PersonConferenceRoomsM2),
      new MetrageItemRow('Overlegruimtes - 10-20 personen', layout.num10PersonConferenceRooms, layout.num10PersonConferenceRoomsM2),
      new MetrageItemRow('Overlegruimtes - tot 50 personen', layout.num50PersonConferenceRooms, layout.num50PersonConferenceRoomsM2),
    ).build());
  }
}

/**
 * Declare it globally
 */
declare global {
  interface Window {
    Output?: Output;
  }
}
export {};
