import {Department} from "$utils/department";
import {DepartmentDropdown} from "$utils/departmentDropdown";
import {Anchor, Div} from "$utils/html";
import {DropDownGroup} from "$utils/factory";
import {
  ExtraRoomsLayout,
  FacilitiesLayout,
  GeneralLayout,
  MeetingSpaceLayout,
  OfficeLayout,
  OtherRoomsLayout, WorkLayout
} from "$utils/variables";
import {officeLayoutIn, toggleModeDepartments} from "$utils/inputs";

export class Form {
  private _officeLayout: OfficeLayout | null = null;
  globalDepartment: Department;
  departments: Array<Department> = new Array<Department>();
  generalLayout: GeneralLayout;
  workLayout: WorkLayout;
  meetingSpaceLayout: MeetingSpaceLayout;
  facilitiesLayout: FacilitiesLayout;
  otherRoomsLayout: OtherRoomsLayout;
  extraRoomsLayout: ExtraRoomsLayout;

  dropdownGroup: DropDownGroup;
  addDepartmentBtn: HTMLAnchorElement;
  // @ts-ignore
  departmentTab: HTMLDivElement = null;
  // @ts-ignore
  globalTab: HTMLDivElement = null;

  constructor() {
    this._officeLayout = new OfficeLayout('LayoutBasic');
    this.dropdownGroup = new DropDownGroup();
    this.globalDepartment = new Department();
    this.workLayout = new WorkLayout();
    this.generalLayout = new GeneralLayout();
    this.meetingSpaceLayout = new MeetingSpaceLayout();
    this.facilitiesLayout = new FacilitiesLayout();
    this.otherRoomsLayout = new OtherRoomsLayout();
    this.extraRoomsLayout = new ExtraRoomsLayout();
    this.addDepartmentBtn = Anchor.build(['button', 'w-button']);
    this.addDepartmentBtn.text = 'Afdeling toevoegen';

    this.generalLayout.addOfficeLayout(officeLayoutIn()?.parentElement?.parentElement?.parentElement?.parentElement);
    this.workLayout.addDepartmentTab(document.getElementsByClassName('tabs w-tabs')[0]);
  }

  init(): void {
    this.departmentTab = document.getElementById('metrage-tab-content-department') as HTMLDivElement;
    this.departmentTab.innerHTML = '';
    this.globalTab = document.getElementById('metrage-tab-content-global') as HTMLDivElement;
    this.globalTab.innerHTML = '';

    this.globalTab.append(this.globalDepartment.build());
    this.departmentTab.append(this.dropdownGroup.build());
    this.departmentTab.append(this.addDepartmentBtn);

    let form: HTMLFormElement = document.getElementById('wf-form-metrageTool') as HTMLFormElement;
    form.prepend(this.workLayout.build());
    form.prepend(this.generalLayout.build());
    form.append(this.meetingSpaceLayout.build());
    form.append(this.facilitiesLayout.build());
    form.append(this.extraRoomsLayout.build());
    form.append(this.otherRoomsLayout.build());

    this.addDepartmentBtn.removeEventListener('click', this.addDepartmentAction);
    this.addDepartmentBtn.addEventListener('click', this.addDepartmentAction);
  }

  addDepartmentAction() {
    window.Form?.addDepartment();
  }

  set officeLayout(value: OfficeLayout | null) {
    this._officeLayout = value;
    window.Output?.reset();
  }

  get officeLayout(): OfficeLayout | null {
    return this._officeLayout;
  }


  addDepartment() {
    let departmentForm: Department = new Department();
    let departmentDropdown: DepartmentDropdown = new DepartmentDropdown(departmentForm);
    this.departments.push(departmentForm);
    this.dropdownGroup.append(departmentDropdown.build());
  }
}

/**
 * Declare it globally
 */
declare global {
  interface Window {
    Form?: Form;
  }
}
export {};
