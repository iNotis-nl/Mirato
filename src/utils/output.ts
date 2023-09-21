import {DepartmentLayout, MODE_DEPARTMENT, MODE_GLOBAL} from '$utils/variables';
import {
  Divider,
  MetrageGroup,
  MetrageHeaderRow,
  MetrageItem,
  MetrageItemRow,
  MetrageTitle,
  MetrageTotalRow
} from "$utils/factory";
import {Div} from "$utils/html";
import type {Department} from "$utils/department";
import type {Facility} from "$utils/helpers";
import {ExtraRoom, m2Sup, MeetingRoom, pageBreak, ratio} from "$utils/helpers";
import {getOfficeLayoutChoice} from "$utils/inputs";


export class Output {

  private _mode: string = MODE_GLOBAL;
  private readonly formContent: HTMLDivElement;
  private readonly formButton: HTMLAnchorElement;
  private readonly outputStack: HTMLDivElement;

  constructor() {
    this.outputStack = document.getElementById('metrage-output') as HTMLDivElement;
    this.outputStack.id = 'output-wrap';
    this.formContent = Div.build(['output'], {'id': 'tool-m2', 'style': 'border:none'});
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
    let group: HTMLDivElement = MetrageGroup.build();
    group.append(MetrageTitle.build(window.Form?.generalLayout.organisationName ?? 'Organisatie'));
    group.append(MetrageItem.build('Aantal medewerkers: ' + window.Form?.generalLayout.numEmployees));
    group.append(MetrageItem.build('Ruimtelijke Layout: ' + getOfficeLayoutChoice()));
    this.formContent.append(group);

    /////////////////////////////////////////////////////////////
    /////////////////////////// Work ////////////////////////////
    /////////////////////////////////////////////////////////////

    console.log('Building Work Layout');
    console.log('Current mode:', this._mode, '|', window.Form?.officeLayout?.type);
    group = MetrageGroup.build();
    group.append(MetrageHeaderRow.build('Werken', 'Aantal', m2Sup()));
    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;

      totalDepartmentsNumber = layout.totalDepartmentNumber;
      totalDepartmentPeople = layout.totalDepartmentPeople;
      totalExtraPlacesAllDepartments = layout.extraSpaces;
      totalExtraPlacesM2AllDepartments = layout.numExtraSpacesM2;

      // @ts-ignore
      departmentSubTotalM2 = window.Form.globalDepartment.departmentLayout.totalDepartmentM2;
      subTotal += departmentSubTotalM2;

      // @ts-ignore
      this.addMetrageList(group, layout);
      group.append(MetrageTotalRow.build('Totaal', totalDepartmentsNumber.toString(), departmentSubTotalM2.toString()));
      group.append(Divider.build());

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

        group.append(MetrageHeaderRow.build(department.departmentLayout.name, 'Aantal', m2Sup()));
        that.addMetrageList(group, department.departmentLayout);
        group.append(MetrageTotalRow.build('Totaal', totalDepartmentsNumber.toString(), departmentSubTotalM2.toString()));
        group.append(Divider.build());
      });
    }
    group.append(MetrageItemRow.build('Werkplekratio', ratio(totalDepartmentPeople, numEmployees)));
    //extraPlacesRatio.addTooltip('Vaste werkplekken / Aantal medewerkers');

    group.append(MetrageItemRow.build('Aanlandplekken', totalExtraPlacesAllDepartments, totalExtraPlacesM2AllDepartments));
    this.formContent.append(group);


    /////////////////////// PAGEBREAK ////////////////////////
    // @ts-ignore
    if (this._mode === MODE_DEPARTMENT && window.Form?.departments.length > 2) {
      this.formContent.append(pageBreak());
      document.getElementsByClassName('section is_tool-m2')[0].setAttribute('style', 'position:inherit');
    }


    {
      /////////////////////////////////////////////////////////////
      /////////////////////// MeetingRooms ////////////////////////
      /////////////////////////////////////////////////////////////
      console.log('Building MeetingRooms');
      // @ts-ignore
      meetingRoomSubTotalM2 = window.Form?.meetingSpaceLayout.totalM2();
      if (meetingRoomSubTotalM2 > 0) {
        let meetingRoomNumTotalPeople: number = 0;
        group = MetrageGroup.build();
        group.append(MetrageHeaderRow.build('Vergaderen', 'Aantal', m2Sup()));
        let meetingsRoomList: MeetingRoom[] = window.Form?.meetingSpaceLayout.list() ?? [];
        meetingsRoomList.forEach((item: MeetingRoom): void => {
          if (item.amount > 0) {
            meetingRoomNumTotalPeople += item.callbackForPeople(item.amount);
            meetingRoomNumTotal += item.amount;
            group.append(MetrageItemRow.build(item.name, item.amount, item.callbackFn(item.amount)));
          }
        });
        // @ts-ignore
        subTotal += meetingRoomSubTotalM2;
        this.formContent.append(group);
        this.formContent.append(Divider.build());
        this.formContent.append(MetrageTotalRow.build('Totaal', meetingRoomNumTotal, meetingRoomSubTotalM2));
        this.formContent.append(MetrageItemRow.build('Werkplekratio incl. aanlandplekken', ratio(totalDepartmentPeople + meetingRoomNumTotalPeople, numEmployees)));
        this.formContent.append(MetrageItemRow.build('Vergadercapaciteit (pax)', meetingRoomNumTotalPeople));
      }
    }

    {
      /////////////////////////////////////////////////////////////
      //////////////////////// Facilities /////////////////////////
      /////////////////////////////////////////////////////////////
      console.log('Building Facilities');
      // @ts-ignore;
      facilitiesSubTotalM2 = window.Form?.facilitiesLayout.totalM2(subTotal, totalDepartmentsNumber);
      group = MetrageGroup.build();
      group.append(MetrageHeaderRow.build('Faciliteiten', 'Aantal', m2Sup()));
      let facilitiesList: Facility[] = window.Form?.facilitiesLayout.list() ?? [];
      facilitiesList.forEach((item: Facility): void => {
        if (item.active) {
          group.append(MetrageItemRow.build(item.name, '', item.callbackFn(subTotal, totalDepartmentsNumber)));
        }
      });
      this.formContent.append(group);
      this.formContent.append(Divider.build());
      this.formContent.append(MetrageTotalRow.build('Totaal', '', facilitiesSubTotalM2));
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
      group = MetrageGroup.build();
      group.append(MetrageHeaderRow.build('Faciliteiten', 'Aantal', m2Sup()));
      let otherRoomsList: Facility[] = window.Form?.otherRoomsLayout.list() ?? [];
      otherRoomsList.forEach((item: Facility): void => {
        if (item.active) {
          group.append(MetrageItemRow.build(item.name, '', item.callbackFn(subTotal, totalDepartmentsNumber)));
        }
      });
      this.formContent.append(group);
      this.formContent.append(Divider.build());
      this.formContent.append(MetrageTotalRow.build('Totaal', '', otherRoomsSubTotalM2));
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
        group = MetrageGroup.build();
        group.append(MetrageHeaderRow.build('Extra ruimtes', 'Aantal', m2Sup()));
        extraRoomsList.forEach((item: ExtraRoom): void => {
          if (item.active) {
            group.append(MetrageItemRow.build(item.name, '', item.callbackFn()));
          }
        });
        this.formContent.append(group);
        // @ts-ignore
        subTotal += extraRoomsSubTotalM2;
      }
    }

    ////////////////////////////////////////////////////////////
    //////////////////// Subtotal & Growth /////////////////////
    ////////////////////////////////////////////////////////////
    console.log('Building Subtotal');
    this.formContent.append(MetrageTitle.build('Subtotaal', subTotal));
    total = subTotal;

    if (expectedGrowth > 0) {
      console.log('Building Growth');
      this.formContent.append(MetrageItemRow.build('Verwachte groei in 5 jaar (' + expectedGrowth + '%)'));

      // Work places
      let departmentTotalM2 = Math.ceil(departmentSubTotalM2 * (expectedGrowth / 100));
      this.formContent.append(MetrageItemRow.build('Werken', '', '+' + departmentTotalM2));
      total += departmentTotalM2;

      if (meetingRoomSubTotalM2 > 0) {
        let meetingRoomTotalM2: number = Math.ceil(meetingRoomSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        this.formContent.append(MetrageItemRow('Vergaderen', '', '+' + meetingRoomTotalM2));
        total += meetingRoomTotalM2;
      }

      // Facility is mostly based on the number of Employees
      // @ts-ignore
      if (facilitiesSubTotalM2 > 0) {
        let facilitiesTotalM2: number = Math.ceil(facilitiesSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        this.formContent.append(MetrageItemRow.build('Faciliteiten', '', '+' + facilitiesTotalM2));
        total += facilitiesTotalM2;
      }

      // Other rooms is mostly based on the number of Employees
      // @ts-ignore
      if (otherRoomsSubTotalM2 > 0) {
        let otherRoomsTotalM2: number = Math.ceil(otherRoomsSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        this.formContent.append(MetrageItemRow.build('Extra ruimtes', '', '+' + otherRoomsTotalM2));
        total += otherRoomsTotalM2;
      }

      if (window.Form?.extraRoomsLayout.hasActive()) {
        let extraRoomTotalM2: number = Math.ceil(extraRoomsSubTotalM2 * (expectedGrowth / 100));
        // @ts-ignore
        this.formContent.append(MetrageItemRow.build('Extra ruimtes', '', '+' + extraRoomTotalM2));
        total += extraRoomTotalM2;
      }
    }

    this.formContent.append(MetrageTitle.build('Totaal', total));

    console.log(' ');
  }

  addMetrageList(outputGroup: HTMLDivElement, layout: DepartmentLayout): void {
    if (layout.numWorkstations > 0) {
      outputGroup.append(MetrageItemRow.build('Aantal open werkplekken', layout.numWorkstations, layout.numWorkstationsM2));
    }

    if (layout.totalPersonsRoomsM2 > 0) {
      if (layout.numCEORooms > 0)
        outputGroup.append(MetrageItemRow.build('Directie ruimtes', layout.numCEORooms, layout.numCEORoomsM2));
      if (layout.num1PersonRooms)
        outputGroup.append(MetrageItemRow.build('Kantoren - 1 persoon', layout.num1PersonRooms, layout.num1PersonRoomsM2));
      if (layout.num2PersonRooms)
        outputGroup.append(MetrageItemRow.build('Kantoren - 2 personen', layout.num2PersonRooms, layout.num2PersonRoomsM2));
      if (layout.num4PersonRooms)
        outputGroup.append(MetrageItemRow.build('Kantoren - 4 personen', layout.num4PersonRooms, layout.num4PersonRoomsM2));
      if (layout.num6PersonRooms)
        outputGroup.append(MetrageItemRow.build('Kantoren - 6 personen', layout.num6PersonRooms, layout.num6PersonRoomsM2));
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
