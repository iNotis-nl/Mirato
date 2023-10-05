import {Department} from "$utils/department";
import {DepartmentDropdown} from "$utils/departmentDropdown";
import {Anchor, Element} from "$utils/html";
import {DropDownGroup} from "$utils/factory";
import {
  ExtraPlacesLayout,
  ExtraRoomsLayout,
  FacilitiesLayout,
  GeneralLayout,
  MeetingSpaceLayout,
  OfficeLayout,
  OtherRoomsLayout,
  WorkLayout
} from "$utils/variables";
import {officeLayoutIn} from "$utils/inputs";

export class Form {
  private _officeLayout: OfficeLayout;
  globalDepartment: Department;
  departments: Array<Department> = new Array<Department>();
  generalLayout: GeneralLayout;
  workLayout: WorkLayout;
  extraPlacesLayout: ExtraPlacesLayout;
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
    this.extraPlacesLayout = new ExtraPlacesLayout();
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
    form.append(this.extraPlacesLayout.build());
    form.append(this.meetingSpaceLayout.build());
    form.append(this.facilitiesLayout.build());
    form.append(this.extraRoomsLayout.build());
    form.append(this.otherRoomsLayout.build());

    this.addDepartmentBtn.removeEventListener('click', this.addDepartmentAction);
    this.addDepartmentBtn.addEventListener('click', this.addDepartmentAction);
  }

  addDepartmentAction(): void {
    window.Form?.addDepartment();
  }

  removeDepartmentAction(departmentId: string): void {
    console.log('removeDepartmentAction', departmentId);
    this.departments.forEach((department: Department, index: number): void => {
      if (department.id === departmentId) {
        delete this.departments[index];
        let dropDownItems: HTMLCollection = this.dropdownGroup.dropDownGroupBody.children;
        for (let i: number = 0; i < dropDownItems.length; i++) {
          let item: Element | null = this.dropdownGroup.dropDownGroupBody.children.item(i);
          if (item instanceof HTMLDivElement && item.dataset['deleteId'] === departmentId) {
            item.remove();
          }
        }
      }
    });
    if (this.departments.length === 0) {
      this.addDepartmentAction();
    } else {
      window.Output?.reset();
    }
  }

  set officeLayout(value: OfficeLayout) {
    this._officeLayout = value;
    window.Output?.reset();
  }

  // This is used, even if PHPStorm says it isn't
  get officeLayout(): OfficeLayout {
    return this._officeLayout;
  }

  addDepartment(): void {
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
