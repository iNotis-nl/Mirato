import {DepartmentLayout, MODE_DEPARTMENT, MODE_GLOBAL} from '$utils/variables';
import {MetrageItemRow, MetrageStack} from "$utils/factory";
import {Div} from "$utils/html";
import type {Department} from "$utils/department";
import type {Facility} from "$utils/helpers";
import {ExtraRoom, MeetingRoom, parseIntOrZero} from "$utils/helpers";


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
    let numWorkstations: number = 0;
    let subTotalDepartment: number = 0;
    let subTotal: number = 0;
    let total: number = 0;
    let averageGrowth: number = 0;

    /////////////////////////////////////////////////////////////
    //////////////////////// Departments ////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Current mode: ', this._mode);
    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;
      numEmployees = layout.numEmployees;
      numWorkstations = layout.numWorkstations;
      // @ts-ignore
      subTotalDepartment += window.Form.globalDepartment.departmentLayout.totalDepartmentM2;
      subTotal += subTotalDepartment;
      // @ts-ignore
      averageGrowth = window.Form.globalDepartment.departmentLayout.expectedGrowth;
      this.addMetrageList(stack, layout);
    } else if (this._mode === MODE_DEPARTMENT) {
      // @ts-ignore
      const departments: Department[] = window.Form.departments;
      departments.forEach(function (department: Department): void {
        console.log('Building department', '"' + department.departmentLayout.name + '"');
        numEmployees += department.departmentLayout.numEmployees;
        numWorkstations = department.departmentLayout.numWorkstations;
        subTotal += department.departmentLayout.totalDepartmentM2;
        averageGrowth += department.departmentLayout.numEmployees * (1 + (department.departmentLayout.expectedGrowth / 100));

        stack.append(new MetrageItemRow(department.departmentLayout.name, '', department.departmentLayout.totalDepartmentM2, 'subheader', ['department']).build());
        that.addMetrageList(stack, department.departmentLayout);
      });
      averageGrowth = parseIntOrZero(Math.round(((averageGrowth / numEmployees) - 1) * 100).toString());
    }

    stack.append(Div.build(['tool-m2_divider', 'is-soft']));

    /////////////////////////////////////////////////////////////
    /////////////////////// MeetingRooms ////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Building MeetingRooms');
    // @ts-ignore
    let meetingRoomSubTotalM2: number = window.Form?.meetingSpaceLayout.totalM2();
    if (meetingRoomSubTotalM2 > 0) {
      let meetingsRoomStack: MetrageStack = new MetrageStack(
        // @ts-ignore
        new MetrageItemRow('Vergaderen', '', meetingRoomSubTotalM2, 'subheader')
      );
      let meetingsRoomList: MeetingRoom[] = window.Form?.meetingSpaceLayout.list() ?? [];
      meetingsRoomList.forEach((item: MeetingRoom): void => {
        if (item.amount > 0) {
          meetingsRoomStack.append(new MetrageItemRow(item.name, '', item.callbackFn(item.amount)));
        }
      });
      // @ts-ignore
      subTotal += meetingRoomSubTotalM2;
      stack.append(meetingsRoomStack.build());
    }

    /////////////////////////////////////////////////////////////
    //////////////////////// Facilities /////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Building Facilities');
    // @ts-ignore;
    let facilitiesSubTotalM2: number = window.Form?.facilitiesLayout.totalM2(numEmployees, subTotal, numWorkstations);
    let facilitiesStack: MetrageStack = new MetrageStack(
      // @ts-ignore
      new MetrageItemRow('Faciliteiten', '', facilitiesSubTotalM2, 'subheader')
    );
    let facilitiesList: Facility[] = window.Form?.facilitiesLayout.list() ?? [];
    facilitiesList.forEach((item: Facility): void => {
      if (item.active) {
        facilitiesStack.append(new MetrageItemRow(item.name, '', item.callbackFn(numEmployees, subTotal, numWorkstations)));
      }
    });
    stack.append(facilitiesStack.build());
    // @ts-ignore
    subTotal += facilitiesSubTotalM2;


    //////////////////////////////////////////////////////////////
    ///////////////////////// Other Rooms ////////////////////////
    //////////////////////////////////////////////////////////////
    console.log('Building Other Rooms');
    // @ts-ignore
    let otherRoomsSubTotalM2: number = window.Form?.otherRoomsLayout.totalM2(numEmployees, subTotal, numWorkstations);
    let otherRoomsStack: MetrageStack = new MetrageStack(
      // @ts-ignore
      new MetrageItemRow('Overige ruimtes', '', otherRoomsSubTotalM2, 'subheader')
    );
    let otherRoomsList: Facility[] = window.Form?.otherRoomsLayout.list() ?? [];
    otherRoomsList.forEach((item: Facility): void => {
      if (item.active) {
        otherRoomsStack.append(new MetrageItemRow(item.name, '', item.callbackFn(numEmployees, subTotal, numWorkstations)));
      }
    });
    stack.append(otherRoomsStack.build());
    // @ts-ignore
    subTotal += otherRoomsSubTotalM2;


    //////////////////////////////////////////////////////////////
    ///////////////////////// Extra Rooms ////////////////////////
    //////////////////////////////////////////////////////////////
    console.log('Building Extra Rooms');
    let extraRoomsList: ExtraRoom[] = window.Form?.extraRoomsLayout.list() ?? [];
    let extraRoomsSubTotalM2: number = 0;
    if (window.Form?.extraRoomsLayout.hasActive()) {
      extraRoomsSubTotalM2 = window.Form?.extraRoomsLayout.totalM2();
      let extraRoomsStack: MetrageStack = new MetrageStack(
        // @ts-ignore
        new MetrageItemRow('Extra ruimtes', '', extraRoomsSubTotalM2, 'subheader')
      );
      extraRoomsList.forEach((item: ExtraRoom): void => {
        if (item.active) {
          extraRoomsStack.append(new MetrageItemRow(item.name, '', item.callbackFn()));
        }
      });
      stack.append(extraRoomsStack.build());
      // @ts-ignore
      subTotal += extraRoomsSubTotalM2;
    }

    ////////////////////////////////////////////////////////////
    //////////////////// Subtotal & Growth /////////////////////
    ////////////////////////////////////////////////////////////
    console.log('Building Subtotal');
    stack.append(Div.build(['tool-m2_divider', 'is-soft']));
    stack.append(new MetrageItemRow('Subtotaal', '', subTotal, 'header').build());
    total = subTotal;
    let numEmployeesGrowth: number = Math.ceil(numEmployees * (1 + (averageGrowth / 100)));
    console.log('After 5 years, we will have a total of', numEmployeesGrowth, 'employees.');

    if (averageGrowth > 0) {
      console.log('Building Growth');
      if (this._mode === MODE_GLOBAL) {
        // @ts-ignore
        stack.append(new MetrageItemRow(
          'Verwachte groei in 5 jaar (' + averageGrowth + '%)',
          '',
          Math.ceil(subTotalDepartment * (averageGrowth / 100)),
          'subheader').build());
        total += Math.ceil(subTotalDepartment * (averageGrowth / 100));
      } else if (this._mode === MODE_DEPARTMENT) {
        stack.append(new MetrageItemRow('Verwachte groei in 5 jaar', '', '', 'subheader').build());
        // @ts-ignore
        const departments: Department[] = window.Form.departments;
        departments.forEach(function (department: Department): void {
          if (department.departmentLayout.expectedGrowth > 0) {
            let departmentGrowth: number = department.departmentLayout.totalGrowth;
            total += departmentGrowth;
            stack.append(new MetrageItemRow(
              department.departmentLayout.name + ' <span>(+' + department.departmentLayout.expectedGrowth + '%)</span>',
              '',
              '+' + departmentGrowth,
              'subheader').build(),
            );
          }
        });
      }

      if (meetingRoomSubTotalM2 > 0) {
        let meetingRoomTotalM2: number = Math.ceil(meetingRoomSubTotalM2 * (averageGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Vergaderen', '', '+' + meetingRoomTotalM2, 'subheader'
          ).build()
        );
        total += meetingRoomTotalM2;
      }

      // Facility is mostly based on the number of Employees
      // @ts-ignore
      let facilitiesTotalM2: number = window.Form?.facilitiesLayout.totalM2(numEmployeesGrowth, subTotal, numWorkstations);
      if (facilitiesTotalM2 > 0) {
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Faciliteiten', '', '+' + (facilitiesTotalM2 - facilitiesSubTotalM2), 'subheader'
          ).build()
        );
        total += (facilitiesTotalM2 - facilitiesSubTotalM2);
      }

      // Other rooms is mostly based on the number of Employees
      // @ts-ignore
      let otherRoomsTotalM2: number = window.Form?.otherRoomsLayout.totalM2(numEmployeesGrowth, subTotal, numWorkstations);
      if (otherRoomsTotalM2 > 0) {
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Extra ruimtes', '', '+' + (otherRoomsTotalM2 - otherRoomsSubTotalM2), 'subheader'
          ).build()
        );
        total += (otherRoomsTotalM2 - otherRoomsSubTotalM2);
      }

      if (window.Form?.extraRoomsLayout.hasActive()) {
        let extraRoomTotalM2: number = Math.ceil(extraRoomsSubTotalM2 * (averageGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Extra ruimtes', '', '+' + extraRoomTotalM2, 'subheader'
          ).build()
        );
        total += extraRoomTotalM2;
      }
    }


    stack.append(Div.build(['tool-m2_divider','is-soft']));
    stack.append(new MetrageItemRow('Totaal', '', total, 'header').build());

    this.formContent.append(stack);
    console.log(' ');
  }

  addMetrageList(stack: HTMLDivElement, layout: DepartmentLayout): void {
    stack.append(new MetrageStack(
      new MetrageItemRow('Medewerkers', layout.numEmployees, '', 'muted'),
      new MetrageItemRow('Werkplekken', layout.numWorkstations, layout.numWorkstationsM2),
    ).build());
    if (layout.totalPersonsRoomsM2 > 0) {
      stack.append(new MetrageStack(
        new MetrageItemRow('Afsluitbare kantoren', '', layout.totalPersonsRoomsM2, 'subheader'),
        layout.numCEORooms > 0 ? new MetrageItemRow('Directie ruimtes', layout.numCEORooms, layout.numCEORoomsM2) : null,
        layout.num1PersonRooms > 0 ? new MetrageItemRow('Kantoren - 1 persoon', layout.num1PersonRooms, layout.num1PersonRoomsM2) : null,
        layout.num2PersonRooms > 0 ? new MetrageItemRow('Kantoren - 2 personen', layout.num2PersonRooms, layout.num2PersonRoomsM2) : null,
        layout.num4PersonRooms > 0 ? new MetrageItemRow('Kantoren - 4 personen', layout.num4PersonRooms, layout.num4PersonRoomsM2) : null,
        layout.num6PersonRooms > 0 ? new MetrageItemRow('Kantoren - 6 personen', layout.num6PersonRooms, layout.num6PersonRoomsM2) : null,
      ).build());
    }
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
