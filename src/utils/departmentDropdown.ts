import {Department} from "./department.js";
import {DropDown, InputFormField} from "$utils/factory";
import {Div} from "$utils/html";
import {createId} from "$utils/helpers";


export class DepartmentDropdown {
  department: Department;
  name: string;
  id: string;

  dropDown: DropDown;
  nameInput: InputFormField;

  constructor(department: Department) {
    // @ts-ignore
    this.id = createId('department');
    this.department = department;
    this.name = 'Afdeling';
    this.nameInput = new InputFormField();
    this.dropDown = new DropDown();
  }

  build(): HTMLDivElement {
    const scriptDiv: HTMLDivElement = Div.build(['fs_accordion-2_embed', 'hide', 'w-embed', 'w-script']);
    scriptDiv.innerHTML = '<!-- [Finsweet Attributes] Accordion -->';
    this.dropDown.append(scriptDiv);

    const script: HTMLScriptElement = document.createElement('script');
    script.innerText = '(()=>{var t="https://cdn.jsdelivr.net/npm/@finsweet/attributes-accordion@1/accordion.js",e=document.querySelector(`script[src="${t}"]`);(e!=null?e.remove():""),(e=document.createElement("script"),e.async=!0,e.src=t,document.head.append(e));})();';
    scriptDiv.append(script);

    this.dropDown.setName(this.name);

    this.dropDown.append(this.nameInput.build('Afdeling', 'Dit is de naam van de afdeling'));
    this.dropDown.append(this.department.build());

    this.nameInput.addEventListener('keyup', (event: KeyboardEvent) => this.nameChanged(event));

    return this.dropDown.build();
  }

  nameChanged(event: KeyboardEvent) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    this.name = String(element.value).substring(0, 1).toUpperCase() + String(element.value).substring(1);
    if (this.name === '') {
      this.name = 'Afdeling';
    }
    this.dropDown.setName(this.name);
    this.department.departmentLayout.name = this.name;
    // @ts-ignore
    window.Output.reset();
  }
}