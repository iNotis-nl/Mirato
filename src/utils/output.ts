import {DepartmentLayout, MODE_DEPARTMENT, MODE_GLOBAL} from '$utils/variables';
import {
  Divider,
  MetrageHeaderRow,
  MetrageInputSubHeaderRow,
  MetrageItemRow,
  MetrageOutputGroup,
  MetrageOutputItem,
  MetrageOutputSubHeaderRow,
  MetrageStatsOutputGroup,
  MetrageTitle,
  MetrageTotalRow
} from "$utils/factory";
import {Div} from "$utils/html";
import type {Department} from "$utils/department";
import type {Facility} from "$utils/helpers";
import {ExtraRoom, fraction, m2Sup, MeetingRoom, pageBreak, ratio} from "$utils/helpers";
import {getOfficeLayoutChoice} from "$utils/inputs";
import tippy from "tippy.js";

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

  getTotalDepartmentWorkstations() {
    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;

      return layout.totalDepartmentPeople;
    } else if (this._mode === MODE_DEPARTMENT) {
      let totalDepartmentsWorkstations: number = 0;
      const departments: Department[] = window.Form?.departments ?? [];
      departments.forEach(function (department: Department): void {
        totalDepartmentsWorkstations += department.departmentLayout.totalDepartmentPeople;
      });
      return totalDepartmentsWorkstations;
    }
    return 0;
  }

  reset() {
    console.log('Rebuilding the Output', this._mode);
    this.formContent.innerHTML = '';
    window.Form?.extraPlacesLayout.updateInfoBoxes();

    const that = this;

    let numEmployees: number = window.Form?.generalLayout.numEmployees ?? 0;
    let expectedGrowth: number = window.Form?.generalLayout.expectedGrowth ?? 0;

    let totalDepartmentsWorkstations: number = 0;
    let totalDepartmentPeople: number = 0;
    let departmentSubTotalM2: number = 0;
    let totalExtraPlaces: number = 0;
    let totalExtraPlacesM2: number = 0;

    let meetingRoomSubTotalM2: number = 0;
    let meetingRoomNumTotal: number = 0;
    let facilitiesSubTotalM2: number = 0;
    let extraRoomsSubTotalM2: number = 0;
    let otherRoomsSubTotalM2: number = 0;

    let subTotal: number = 0;
    let total: number = 0;

    /////////////////////////////////////////////////////////////
    ////////////////////////// General/ /////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Building General Data');
    let group: HTMLDivElement = MetrageOutputGroup.build();
    if (window.Form?.generalLayout.organisationName) {
      group.append(MetrageTitle.build(window.Form?.generalLayout.organisationName ?? 'Organisatie'));
    }
    group.append(MetrageOutputItem.build('Aantal medewerkers: ' + window.Form?.generalLayout.numEmployees));
    group.append(MetrageOutputItem.build('Ruimtelijke Layout: ' + getOfficeLayoutChoice()));
    this.formContent.append(group);

    /////////////////////////////////////////////////////////////
    /////////////////////////// Work ////////////////////////////
    /////////////////////////////////////////////////////////////
    console.log('Building Work Layout');
    console.log('Current mode:', this._mode, '|', window.Form?.officeLayout?.type);
    totalExtraPlaces = window.Form?.extraPlacesLayout.extraPlaces ?? 0;
    totalExtraPlacesM2 = window.Form?.extraPlacesLayout.extraPlacesM2() ?? 0;
    departmentSubTotalM2 += totalExtraPlacesM2;
    subTotal += totalExtraPlacesM2;

    group = MetrageOutputGroup.build();
    group.append(MetrageHeaderRow.build('Werken', 'Aantal', m2Sup()));
    if (this._mode === MODE_GLOBAL) {
      // @ts-ignore
      const layout: DepartmentLayout = window.Form.globalDepartment.departmentLayout;

      totalDepartmentsWorkstations = layout.totalDepartmentWorkstations;
      totalDepartmentPeople = layout.totalDepartmentPeople;

      // @ts-ignore
      departmentSubTotalM2 = window.Form.globalDepartment.departmentLayout.totalDepartmentM2;
      subTotal += departmentSubTotalM2;

      // @ts-ignore
      this.addMetrageList(group, layout);
      if (totalExtraPlaces > 0) {
        group.append(MetrageItemRow.build('Aanlandplekken', totalExtraPlaces, totalExtraPlacesM2));
      }
      group.append(Divider.build());
      group.append(MetrageTotalRow.build('Totaal', departmentSubTotalM2.toString()));

    } else if (this._mode === MODE_DEPARTMENT) {
      // @ts-ignore
      const departments: Department[] = window.Form.departments;
      if (totalExtraPlaces > 0) {
        group.append(MetrageItemRow.build('Aanlandplekken', totalExtraPlaces, totalExtraPlacesM2));
      }
      departments.forEach(function (department: Department): void {
        console.log('Building department', '"' + department.departmentLayout.name + '"');
        let tempTotalDepartmentsNumber: number = department.departmentLayout.totalDepartmentWorkstations;
        let tempTotalDepartmentPeople: number = department.departmentLayout.totalDepartmentPeople;

        totalDepartmentsWorkstations += tempTotalDepartmentsNumber;
        totalDepartmentPeople += tempTotalDepartmentPeople;

        departmentSubTotalM2 = department.departmentLayout.totalDepartmentM2;
        subTotal += departmentSubTotalM2;

        group.append(MetrageInputSubHeaderRow.build(department.departmentLayout.name));
        that.addMetrageList(group, department.departmentLayout);
        group.append(Divider.build());
        group.append(MetrageTotalRow.build('Totaal', departmentSubTotalM2.toString()));
      });
    }
    this.formContent.append(group);

    /////////////////////// Work Stats ////////////////////////
    let workStatsGroup: HTMLDivElement = MetrageStatsOutputGroup.build();
    workStatsGroup.append(MetrageItemRow.build(
      'Totaal aantal vaste werkplekken', totalDepartmentPeople, '&nbsp;', '&nbsp;')
    );
    workStatsGroup.append(MetrageItemRow.build(
      'Werkplekratio', ratio(totalDepartmentPeople, numEmployees), '&nbsp;', '&nbsp;')
    );
    //extraPlacesRatio.addTooltip('Vaste werkplekken / Aantal medewerkers');
    workStatsGroup.append(MetrageItemRow.build(
      'Aanlandplekken', totalExtraPlaces, '&nbsp;', '&nbsp;')
    );
    workStatsGroup.append(MetrageItemRow.build(
      'Werkplekratio incl. aanlandplekken',
      ratio(totalDepartmentPeople + totalExtraPlaces, numEmployees), '&nbsp;', '&nbsp;')
    );
    this.formContent.append(workStatsGroup);


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
      let meetingRoomNumTotalPeople: number = 0;
      group = MetrageOutputGroup.build();
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
      group.append(Divider.build());
      group.append(MetrageTotalRow.build('Totaal', meetingRoomSubTotalM2));
      this.formContent.append(group);

      let meetingRoomStatsGroup: HTMLDivElement = MetrageStatsOutputGroup.build();
      meetingRoomStatsGroup.append(MetrageItemRow.build(
        'Belplekratio', fraction(window.Form?.meetingSpaceLayout.num1pCallPlaces() ?? 0, totalDepartmentsWorkstations + totalExtraPlaces), '&nbsp;', '&nbsp;')
      );
      meetingRoomStatsGroup.append(MetrageItemRow.build(
        'Totaal aantal vergaderplekken', meetingRoomNumTotalPeople, '&nbsp;', '&nbsp;')
      );
      this.formContent.append(meetingRoomStatsGroup);

    }

    {
      /////////////////////////////////////////////////////////////
      //////////////////////// Facilities /////////////////////////
      /////////////////////////////////////////////////////////////
      console.log('Building Facilities');
      // @ts-ignore;
      facilitiesSubTotalM2 = window.Form?.facilitiesLayout.totalM2(subTotal, totalDepartmentsWorkstations, totalExtraPlaces);
      group = MetrageOutputGroup.build();
      group.append(MetrageHeaderRow.build('Faciliteiten', m2Sup()));
      let facilitiesList: Facility[] = window.Form?.facilitiesLayout.list() ?? [];
      facilitiesList.forEach((item: Facility): void => {
        if (item.active) {
          group.append(MetrageItemRow.build(item.name, item.callbackFn(subTotal, totalDepartmentsWorkstations, totalExtraPlaces)));
        }
      });
      group.append(Divider.build());
      group.append(MetrageTotalRow.build('Totaal', facilitiesSubTotalM2));
      this.formContent.append(group);
      // @ts-ignore
      subTotal += facilitiesSubTotalM2;
    }

    {
      //////////////////////////////////////////////////////////////
      ///////////////////////// Extra Rooms ////////////////////////
      //////////////////////////////////////////////////////////////
      console.log('Building Extra Rooms');
      let extraRoomsList: ExtraRoom[] = window.Form?.extraRoomsLayout.list() ?? [];
      if (extraRoomsList.length > 0) {
        // @ts-ignore
        extraRoomsSubTotalM2 = window.Form?.extraRoomsLayout.totalM2();
        group = MetrageOutputGroup.build();
        group.append(MetrageHeaderRow.build('Extra ruimtes', m2Sup()));
        extraRoomsList.forEach((item: ExtraRoom): void => {
          if (item.active) {
            group.append(MetrageItemRow.build(item.name, '', item.callbackFn()));
          }
        });
        group.append(Divider.build());
        group.append(MetrageTotalRow.build('Totaal', extraRoomsSubTotalM2));
        this.formContent.append(group);
        // @ts-ignore
        subTotal += extraRoomsSubTotalM2;
      }
    }

    {
      //////////////////////////////////////////////////////////////
      ///////////////////////// Other Rooms ////////////////////////
      //////////////////////////////////////////////////////////////
      console.log('Building Other Rooms');
      // @ts-ignore
      otherRoomsSubTotalM2 = window.Form?.otherRoomsLayout.totalM2(subTotal, totalDepartmentsWorkstations, totalExtraPlaces);
      group = MetrageOutputGroup.build();
      group.append(MetrageHeaderRow.build('Overige', m2Sup()));
      let otherRoomsList: Facility[] = window.Form?.otherRoomsLayout.list() ?? [];
      otherRoomsList.forEach((item: Facility): void => {
        if (item.active) {
          group.append(MetrageItemRow.build(item.name, '', item.callbackFn(subTotal, totalDepartmentsWorkstations, totalExtraPlaces)));
        }
      });
      group.append(Divider.build());
      group.append(MetrageTotalRow.build('Totaal', otherRoomsSubTotalM2));
      this.formContent.append(group);
      // @ts-ignore
      subTotal += otherRoomsSubTotalM2;
    }

    ////////////////////////////////////////////////////////////
    //////////////////// Subtotal & Growth /////////////////////
    ////////////////////////////////////////////////////////////
    console.log('Building Subtotal');
    this.formContent.append(MetrageTitle.build('Subtotaal ' + m2Sup(), subTotal));
    total = subTotal;

    if (expectedGrowth > 0) {
      console.log('Building Growth');
      let growthGroup: HTMLDivElement = MetrageOutputGroup.build();
      growthGroup.append(MetrageOutputSubHeaderRow.build('Groei', 'Percentage', m2Sup()));
      growthGroup.append(MetrageItemRow.build('Verwachte groei in 5 jaar', expectedGrowth + '%', Math.round((subTotal / 100) * expectedGrowth)));
      this.formContent.append(growthGroup);
      total += Math.round((subTotal / 100) * expectedGrowth);
    }

    this.formContent.append(MetrageTitle.build('Totaal ' + m2Sup(), total));
    tippy('[data-tippy-content]', {
      placement: 'auto-start',
      arrow: false,
      trigger: 'mouseenter click',
      theme: 'mirato'
    });

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
