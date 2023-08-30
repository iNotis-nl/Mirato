import {DepartmentLayout, MODE_DEPARTMENT, MODE_GLOBAL} from '$utils/variables';
import {MetrageItemRow, MetrageStack} from "$utils/factory";
import {Div, Span} from "$utils/html";
import type {Department} from "$utils/department";
import type {Facility} from "$utils/helpers";
import {ExtraRoom, MeetingRoom, ratio} from "$utils/helpers";
import {getOfficeLayoutChoice} from "$utils/inputs";


export class Output {

  private _mode: string = MODE_GLOBAL;
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

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
    this.reset();
  }

  reset() {
    console.log('Rebuilding the Output', this._mode);
    this.formContent.innerHTML = '';

    let stack: HTMLDivElement = Div.build(['stack', 'gap-small']);
    const that = this;

    let numEmployees: number = window.Form?.generalLayout.numEmployees ?? 0;
    let expectedGrowth: number = window.Form?.generalLayout.expectedGrowth ?? 0;

    let totalDepartmentsNumber: number = 0;
    let totalDepartmentPeople: number = 0;
    let departmentSubTotalM2: number = 0;
    let totalExtraPlacesAllDepartments: number = 0;
    let totalExtraPlacesM2AllDepartments: number = 0;

    let meetingRoomSubTotalM2: number = 0;
    let meetingRoomNumTotal: number = 0;
    let facilitiesSubTotalM2: number = 0;
    let otherRoomsSubTotalM2: number = 0;
    let extraRoomsSubTotalM2: number = 0;

    let subTotal: number = 0;
    let total: number = 0;

    /////////////////////////////////////////////////////////////
    ////////////////////////// General/ /////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Building General Data');
    this.formContent.append(new MetrageItemRow(window.Form?.generalLayout.organisationName ?? 'Organisatie', '', '', 'header').build());

    let numEmployeesSpan: HTMLSpanElement = Span.build(['output-general-num-employees']);
    numEmployeesSpan.innerHTML = 'Aantal medewerkers: ' + window.Form?.generalLayout.numEmployees;
    this.formContent.append(numEmployeesSpan);

    let layoutSpan: HTMLSpanElement = Span.build(['output-general-layout']);
    layoutSpan.innerHTML = 'Ruimtelijke Layout: ' + getOfficeLayoutChoice();
    this.formContent.append(layoutSpan);

    /////////////////////////////////////////////////////////////
    /////////////////////////// Work ////////////////////////////
    /////////////////////////////////////////////////////////////

    console.log('Building Work Layout');
    console.log('Current mode:', this._mode, '|', window.Form?.officeLayout?.type);
    stack.append(new MetrageItemRow('Werken', '', '', 'subheader').build());
    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;
      totalDepartmentsNumber = layout.totalDepartmentNumber;
      totalDepartmentPeople = layout.totalDepartmentPeople;
      // @ts-ignore
      departmentSubTotalM2 = window.Form.globalDepartment.departmentLayout.totalDepartmentM2;
      subTotal += departmentSubTotalM2;
      // @ts-ignore
      this.addMetrageList(stack, layout, window.Form.globalDepartment);
      stack.append(new MetrageItemRow('Totaal', totalDepartmentsNumber, departmentSubTotalM2, 'total').build());
      let extraPlacesRatio: MetrageItemRow = new MetrageItemRow('Werkplekratio', ratio(totalDepartmentPeople, numEmployees), '');
      extraPlacesRatio.addTooltip('Vaste werkplekken / Aantal medewerkers');
      stack.append(extraPlacesRatio.build());
      totalExtraPlacesAllDepartments = layout.extraSpaces;
      totalExtraPlacesM2AllDepartments = layout.numExtraSpacesM2;

    } else if (this._mode === MODE_DEPARTMENT) {
      // @ts-ignore
      const departments: Department[] = window.Form.departments;
      departments.forEach(function (department: Department): void {
        console.log('Building department', '"' + department.departmentLayout.name + '"');
        let tempTotalDepartmentsNumber: number = department.departmentLayout.totalDepartmentNumber;
        let tempTotalDepartmentPeople: number = department.departmentLayout.totalDepartmentPeople;

        totalDepartmentsNumber += tempTotalDepartmentsNumber;
        totalDepartmentPeople += tempTotalDepartmentPeople;

        totalExtraPlacesAllDepartments += department.departmentLayout.extraSpaces;
        totalExtraPlacesM2AllDepartments += department.departmentLayout.numExtraSpacesM2;

        departmentSubTotalM2 = department.departmentLayout.totalDepartmentM2;
        subTotal += departmentSubTotalM2;

        stack.append(new MetrageItemRow(department.departmentLayout.name, '', '', 'subheader', ['department']).build());
        that.addMetrageList(stack, department.departmentLayout, department);
        stack.append(new MetrageItemRow('Totaal', tempTotalDepartmentsNumber, departmentSubTotalM2, 'total').build());
      });
      let extraPlacesRatio: MetrageItemRow = new MetrageItemRow('Werkplekratio', ratio(totalDepartmentPeople, numEmployees), '');
      extraPlacesRatio.addTooltip('Vaste werkplekken/aantal medewerkers');
      stack.append(extraPlacesRatio.build());
    }
    stack.append(new MetrageItemRow('Aanlandplekken', totalExtraPlacesAllDepartments, totalExtraPlacesM2AllDepartments).build());

    stack.append(Div.build(['tool-m2_divider', 'is-soft']));

    {
      /////////////////////////////////////////////////////////////
      /////////////////////// MeetingRooms ////////////////////////
      /////////////////////////////////////////////////////////////
      console.log('Building MeetingRooms');
      // @ts-ignore
      meetingRoomSubTotalM2 = window.Form?.meetingSpaceLayout.totalM2();
      if (meetingRoomSubTotalM2 > 0) {
        let meetingRoomNumTotalPeople: number = 0;
        let meetingsRoomStack: MetrageStack = new MetrageStack(
          // @ts-ignore
          new MetrageItemRow('Vergaderen', '', '', 'subheader')
        );
        let meetingsRoomList: MeetingRoom[] = window.Form?.meetingSpaceLayout.list() ?? [];
        meetingsRoomList.forEach((item: MeetingRoom): void => {
          if (item.amount > 0) {
            meetingRoomNumTotalPeople += item.callbackForPeople(item.amount);
            meetingRoomNumTotal += item.amount;
            meetingsRoomStack.append(new MetrageItemRow(item.name, item.amount, item.callbackFn(item.amount)));
          }
        });
        // @ts-ignore
        subTotal += meetingRoomSubTotalM2;
        stack.append(meetingsRoomStack.build());
        stack.append(new MetrageItemRow('Totaal', meetingRoomNumTotal, meetingRoomSubTotalM2, 'total').build());
        stack.append(new MetrageItemRow('Werkplekratio incl. aanlandplekken',
          ratio(totalDepartmentPeople + meetingRoomNumTotalPeople, numEmployees), '', '').build());
        stack.append(new MetrageItemRow('Vergadercapaciteit (pax)', meetingRoomNumTotalPeople, '', '').build());
        stack.append(Div.build(['tool-m2_divider', 'is-soft']));
      }
    }

    {
      /////////////////////////////////////////////////////////////
      //////////////////////// Facilities /////////////////////////
      /////////////////////////////////////////////////////////////
      console.log('Building Facilities');
      // @ts-ignore;
      facilitiesSubTotalM2 = window.Form?.facilitiesLayout.totalM2(subTotal, totalDepartmentsNumber);
      let facilitiesStack: MetrageStack = new MetrageStack(
        // @ts-ignore
        new MetrageItemRow('Faciliteiten', '', facilitiesSubTotalM2, 'subheader')
      );
      let facilitiesList: Facility[] = window.Form?.facilitiesLayout.list() ?? [];
      facilitiesList.forEach((item: Facility): void => {
        if (item.active) {
          facilitiesStack.append(new MetrageItemRow(item.name, '', item.callbackFn(subTotal, totalDepartmentsNumber)));
        }
      });
      stack.append(facilitiesStack.build());
      stack.append(new MetrageItemRow('Totaal', '', facilitiesSubTotalM2, 'total').build());
      stack.append(Div.build(['tool-m2_divider', 'is-soft']));
      // @ts-ignore
      subTotal += facilitiesSubTotalM2;
    }

    {
      //////////////////////////////////////////////////////////////
      ///////////////////////// Other Rooms ////////////////////////
      //////////////////////////////////////////////////////////////
      console.log('Building Other Rooms');
      // @ts-ignore
      otherRoomsSubTotalM2 = window.Form?.otherRoomsLayout.totalM2(subTotal, totalDepartmentsNumber);
      let otherRoomsStack: MetrageStack = new MetrageStack(
        // @ts-ignore
        new MetrageItemRow('Overige ruimtes', '', otherRoomsSubTotalM2, 'subheader')
      );
      let otherRoomsList: Facility[] = window.Form?.otherRoomsLayout.list() ?? [];
      otherRoomsList.forEach((item: Facility): void => {
        if (item.active) {
          otherRoomsStack.append(new MetrageItemRow(item.name, '', item.callbackFn(subTotal, totalDepartmentsNumber)));
        }
      });
      stack.append(otherRoomsStack.build());
      stack.append(new MetrageItemRow('Totaal', '', otherRoomsSubTotalM2, 'total').build());
      stack.append(Div.build(['tool-m2_divider', 'is-soft']));
      // @ts-ignore
      subTotal += otherRoomsSubTotalM2;
    }

    {
      //////////////////////////////////////////////////////////////
      ///////////////////////// Extra Rooms ////////////////////////
      //////////////////////////////////////////////////////////////
      console.log('Building Extra Rooms');
      let extraRoomsList: ExtraRoom[] = window.Form?.extraRoomsLayout.list() ?? [];
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
    }

    ////////////////////////////////////////////////////////////
    //////////////////// Subtotal & Growth /////////////////////
    ////////////////////////////////////////////////////////////
    console.log('Building Subtotal');
    stack.append(Div.build(['tool-m2_divider', 'is-soft']));
    stack.append(new MetrageItemRow('Subtotaal', '', subTotal, 'header').build());
    total = subTotal;

    if (expectedGrowth > 0) {
      console.log('Building Growth');
      stack.append(new MetrageItemRow(
        'Verwachte groei in 5 jaar (' + expectedGrowth + '%)',
        '',
        '',
        'muted').build());

      // Work places
      let departmentTotalM2 = Math.ceil(departmentSubTotalM2 * (expectedGrowth / 100));
      stack.append(new MetrageItemRow('Werken', '', '+' + departmentTotalM2, '').build());
      total += departmentTotalM2;

      if (meetingRoomSubTotalM2 > 0) {
        let meetingRoomTotalM2: number = Math.ceil(meetingRoomSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Vergaderen', '', '+' + meetingRoomTotalM2, ''
          ).build()
        );
        total += meetingRoomTotalM2;
      }

      // Facility is mostly based on the number of Employees
      // @ts-ignore
      if (facilitiesSubTotalM2 > 0) {
        let facilitiesTotalM2: number = Math.ceil(facilitiesSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Faciliteiten', '', '+' + facilitiesTotalM2, ''
          ).build()
        );
        total += facilitiesTotalM2;
      }

      // Other rooms is mostly based on the number of Employees
      // @ts-ignore
      if (otherRoomsSubTotalM2 > 0) {
        let otherRoomsTotalM2: number = Math.ceil(otherRoomsSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Extra ruimtes', '', '+' + otherRoomsTotalM2, ''
          ).build()
        );
        total += otherRoomsTotalM2;
      }

      if (window.Form?.extraRoomsLayout.hasActive()) {
        let extraRoomTotalM2: number = Math.ceil(extraRoomsSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        stack.append(new MetrageItemRow(
            'Extra ruimtes', '', '+' + extraRoomTotalM2, 'subheader'
          ).build()
        );
        total += extraRoomTotalM2;
      }
    }

    stack.append(new MetrageItemRow('Totaal', '', total, 'header').build());

    this.formContent.append(stack);
    console.log(' ');
  }

  addMetrageList(stack: HTMLDivElement, layout: DepartmentLayout, department: Department): void {
    const departmentStack: MetrageStack = new MetrageStack();

    if (layout.numWorkstations > 0) {
      departmentStack.append(new MetrageItemRow('Aantal open werkplekken', layout.numWorkstations, layout.numWorkstationsM2));
    }

    if (layout.totalPersonsRoomsM2 > 0) {
      if (layout.numCEORooms > 0)
        departmentStack.append(new MetrageItemRow('Directie ruimtes', layout.numCEORooms, layout.numCEORoomsM2));
      if (layout.num1PersonRooms)
        departmentStack.append(new MetrageItemRow('Kantoren - 1 persoon', layout.num1PersonRooms, layout.num1PersonRoomsM2));
      if (layout.num2PersonRooms)
        departmentStack.append(new MetrageItemRow('Kantoren - 2 personen', layout.num2PersonRooms, layout.num2PersonRoomsM2));
      if (layout.num4PersonRooms)
        departmentStack.append(new MetrageItemRow('Kantoren - 4 personen', layout.num4PersonRooms, layout.num4PersonRoomsM2));
      if (layout.num6PersonRooms)
        departmentStack.append(new MetrageItemRow('Kantoren - 6 personen', layout.num6PersonRooms, layout.num6PersonRoomsM2));
    }

    stack.append(departmentStack.build());
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
