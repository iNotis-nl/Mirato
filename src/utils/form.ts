import {Department} from "$utils/department";
import {DepartmentDropdown} from "$utils/departmentDropdown";
import {Anchor} from "$utils/html";
import {DropDownGroup} from "$utils/factory";
import {ExtraRoomsLayout, FacultiesLayout, OfficeLayout} from "$utils/variables";

export class Form {
  private _officeLayout: OfficeLayout | null = null;
  globalDepartment: Department;
  departments: Array<Department> = new Array<Department>();
  facultiesLayout: FacultiesLayout;
  extraRoomsLayout: ExtraRoomsLayout;
  ids: Array<string> = new Array<string>();

  dropdownGroup: DropDownGroup;
  addDepartmentBtn: HTMLAnchorElement;
  // @ts-ignore
  departmentTab: HTMLDivElement = null;
  // @ts-ignore
  globalTab: HTMLDivElement = null;

  constructor() {
    this.dropdownGroup = new DropDownGroup();
    this.globalDepartment = new Department();
    this.facultiesLayout = new FacultiesLayout();
    this.extraRoomsLayout = new ExtraRoomsLayout();
    this.addDepartmentBtn = Anchor.build(['button', 'w-button']);
    this.addDepartmentBtn.text = 'Afdeling toevoegen';
  }

  init() {
    this.departmentTab = document.getElementById('metrage-tab-content-department') as HTMLDivElement;
    this.departmentTab.innerHTML = '';
    this.globalTab = document.getElementById('metrage-tab-content-global') as HTMLDivElement;
    this.globalTab.innerHTML = '';

    this.globalTab.append(this.globalDepartment.build());
    this.departmentTab.append(this.dropdownGroup.build());
    this.departmentTab.append(this.addDepartmentBtn);

    let form = document.getElementById('wf-form-metrageTool') as HTMLFormElement;
    form.append(this.facultiesLayout.build());
    form.append(this.extraRoomsLayout.build());

    this.addDepartmentBtn.addEventListener('click', function () {
      window.Form?.addDepartment();
    });
  }

  set officeLayout(value: OfficeLayout | null) {
    this._officeLayout = value;
    window.Output?.reset();
  }

  get officeLayout(): OfficeLayout | null {
    return this._officeLayout;
  }


  addDepartment() {
    let departmentForm = new Department();
    let departmentDropdown = new DepartmentDropdown(departmentForm);
    this.departments.push(departmentForm);
    this.dropdownGroup.append(departmentDropdown.build());
  }

  // @ts-ignore
  createId(namespace: string) {
    let id = namespace + '-' + this.createRandom(5);
    if (this.ids.indexOf(id) > -1 || document.getElementById(id) !== null) {
      return this.createId(namespace);
    }

    return id;
  }

  createRandom(length: number) {
    let rand = crypto.randomUUID().replace(/[^0-9aeiouy]/gi, '');
    while (rand.length < length) {
      rand = rand + crypto.randomUUID().replace(/[^0-9aeiouy]/gi, '');
    }
    return rand.substring(0, length);
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
