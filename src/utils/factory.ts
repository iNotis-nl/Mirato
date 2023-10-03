/**
 * Factory to create elements in the Form window
 */
import {Div, Input, Label} from "$utils/html";
import {createId, DeleteIcon, TooltipIcon} from "$utils/helpers";

export class MetrageInputGroup {
  static build(): HTMLDivElement {
    return Div.build(['metrage-input_group']);
  }
}

export class MetrageOutputGroup {
  static build(): HTMLDivElement {
    return Div.build(['metrage-output_group']);
  }
}

export class MetrageStatsOutputGroup {
  static build(): HTMLDivElement {
    return Div.build(['metrage-output_group-stats']);
  }
}

export class MetrageStatsInputGroup {
  static build(): HTMLDivElement {
    return Div.build(['metrage-input_group-stats']);
  }
}

export class MetrageInputHeaderRow {
  static build(title: string, tooltip: string | null = null): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-input_group-header']);
    let headerName: HTMLDivElement = Div.build(['metrage-input_header-name']);
    headerName.innerHTML = title;
    groupHeader.append(headerName);
    if (tooltip) {
      groupHeader.append(TooltipIcon(tooltip));
    }

    return groupHeader;
  }
}

export class MetrageHeaderRow {
  static build(title: string, value1: string | null = null, value2: string | null = null): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-output_group-header']);
    let headerName: HTMLDivElement = Div.build(['metrage-output_header-name']);
    headerName.innerHTML = title;
    groupHeader.append(headerName);
    if (value1) {
      let headerValue1: HTMLDivElement = Div.build(['metrage-output_header-value1']);
      headerValue1.innerHTML = value1;
      groupHeader.append(headerValue1);
    }
    if (value2) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-output_header-value2']);
      headerValue2.innerHTML = value2;
      groupHeader.append(headerValue2);
    }
    return groupHeader;
  }
}

export class MetrageInputSubHeaderRow {
  static build(title: string, value1: string | null = null, value2: string | null = null): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-input_group-subheader']);
    let headerName: HTMLDivElement = Div.build(['metrage-input_subheader-name']);
    headerName.innerHTML = title;
    groupHeader.append(headerName);
    if (value1) {
      let headerValue1: HTMLDivElement = Div.build(['metrage-input_subheader-value1']);
      headerValue1.innerHTML = value1;
      groupHeader.append(headerValue1);
    }
    if (value2) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-input_subheader-value2']);
      headerValue2.innerHTML = value2;
      groupHeader.append(headerValue2);
    }
    return groupHeader;
  }
}

export class MetrageOutputSubHeaderRow {
  static build(title: string, value1: string | null = null, value2: string | null = null): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-output_group']);
    let headerName: HTMLDivElement = Div.build(['metrage-output_subheader-name']);
    headerName.innerHTML = title;
    groupHeader.append(headerName);
    if (value1) {
      let headerValue1: HTMLDivElement = Div.build(['metrage-output_subheader-value1']);
      headerValue1.innerHTML = value1;
      groupHeader.append(headerValue1);
    }
    if (value2) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-output_subheader-value2']);
      headerValue2.innerHTML = value2;
      groupHeader.append(headerValue2);
    }
    return groupHeader;
  }
}

export class MetrageTotalRow {
  static build(title: string, value1: number | string | null = null, value2: number | string | null = null): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-output_group-total']);
    let headerName: HTMLDivElement = Div.build(['metrage-output_item-name']);
    headerName.innerHTML = title;
    groupHeader.append(headerName);
    if (value1) {
      let headerValue1: HTMLDivElement = Div.build(['metrage-output_item-value1']);
      headerValue1.innerHTML = value1.toString();
      groupHeader.append(headerValue1);
    }
    if (value2) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-output_item-value2']);
      headerValue2.innerHTML = value2.toString();
      groupHeader.append(headerValue2);
    }
    return groupHeader;
  }
}

export class MetrageItemRow {
  static build(
    title: string, value1: number | string | null = null,
    value2: number | string | null = null,
    value3: number | string | null = null
  ): HTMLDivElement {
    let groupHeader: HTMLDivElement = Div.build(['metrage-output_item']);
    let itemName: HTMLDivElement = Div.build(['metrage-output_item-name']);
    itemName.innerHTML = title;
    groupHeader.append(itemName);
    if (value1) {
      let headerValue1: HTMLDivElement = Div.build(['metrage-output_item-value1']);
      headerValue1.innerHTML = value1.toString();
      groupHeader.append(headerValue1);
    }
    if (value2) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-output_item-value2']);
      headerValue2.innerHTML = value2.toString();
      groupHeader.append(headerValue2);
    }
    if (value3) {
      let headerValue2: HTMLDivElement = Div.build(['metrage-output_item-value2']);
      headerValue2.innerHTML = value3.toString();
      groupHeader.append(headerValue2);
    }
    return groupHeader;
  }
}

export class DropDownGroup {
  dropDownGroupBody: HTMLDivElement;
  initial: number = -1;

  constructor() {
    this.dropDownGroupBody = Div.build(['fs_accordion-2_component'], {
      'fs-accordion-single': true,
      'fs-accordion-element': 'group',
      'fs-accordion-initial': -1
    });
  }

  build(): HTMLDivElement {
    return this.dropDownGroupBody;
  }

  append(htmlDivElement: HTMLDivElement): void {
    if (this.initial === 0) {
      this.initial = 1;
    }
    this.initial++;
    this.dropDownGroupBody.setAttribute('fs-accordion-initial', this.initial.toString());
    this.dropDownGroupBody.append(htmlDivElement);
  }
}

export class DropDown {
  id: string;
  deleteId: string;
  dropDownBody: HTMLDivElement;
  dropDownTitleDiv: HTMLDivElement;

  constructor(deleteId: string) {
    this.id = createId('dropdown');
    this.deleteId = deleteId;
    this.dropDownBody = Div.build(['tool-m2-department']);
    this.dropDownTitleDiv = Div.build(['fs_accordion-2_label']);
  }

  append(item: HTMLElement): void {
    this.dropDownBody.append(item);
  }

  build(): HTMLDivElement {
    // DropDown
    const dropDown: HTMLDivElement = Div.build(['fs_accordion-2_item'], {'fs-accordion-element': 'accordion', 'data-delete-id':this.deleteId});

    // Header/Name
    const dropDownTitle: HTMLDivElement = Div.build(['fs_accordion-2_header'], {
      'role': 'button',
      'id': this.id + '-header',
      'aria-controls': this.id + '-content',
      'aria-expanded': 'false',
      'fs-accordion-element': 'trigger',
      'tabindex': 0
    });
    dropDown.append(dropDownTitle);

    dropDownTitle.append(this.dropDownTitleDiv);
    this.dropDownTitleDiv.textContent = 'Afdeling';

    const dropDownArrow: HTMLDivElement = Div.build(['fs_accordion-2_arrow-wrapper'], {'fs-accordion-element': 'arrow'});
    dropDownTitle.append(dropDownArrow);

    const deleteIcon: HTMLImageElement = DeleteIcon();
    deleteIcon.addEventListener('click', () => window.Form?.removeDepartmentAction(this.deleteId));
    dropDownTitle.append(deleteIcon);

    const dropDownArrowIcon: HTMLDivElement = Div.build(['fs_accordion-2_icon', 'w-icon-dropdown-toggle']);
    dropDownArrow.append(dropDownArrowIcon);

    // Content Box
    const dropdownContent: HTMLDivElement = Div.build(['fs_accordion-2_content'], {
      'id': this.id + '-content',
      'aria-labelledby': this.id + '-header',
      'fs-accordion-element': 'content'
    });
    dropdownContent.style.maxHeight = '0px';
    dropdownContent.style.display = 'none';
    dropDown.append(dropdownContent);

    const dropdownBodyContainer: HTMLDivElement = Div.build([('fs_accordion-2_body')]);
    dropdownContent.append(dropdownBodyContainer);
    dropdownBodyContainer.append(this.dropDownBody);

    return dropDown;
  }

  setName(name: string): void {
    this.dropDownTitleDiv.textContent = name;
  }
}

export class MetrageTitle {
  static build(name: string, value: number | string | null = null): HTMLDivElement {
    let titleItem: HTMLDivElement = Div.build(['metrage-output_title-item']);
    let titleName: HTMLDivElement = Div.build(['metrage-output_title-name']);
    titleName.innerHTML = name;
    titleItem.append(titleName);
    if (value) {
      let titleValue: HTMLDivElement = Div.build(['metrage-output_title-value']);
      titleValue.innerHTML = value.toString();
      titleItem.append(titleValue);
    }
    return titleItem;
  }
}

export class MetrageInputItem {
  static build(name: string,
               value1: string | number | null = null,
               value2: string | number | null = null,
               tooltip: string | null = null): HTMLDivElement {
    let titleItem: HTMLDivElement = Div.build(['metrage-input_item']);
    let titleName: HTMLDivElement = Div.build(['metrage-input_item-name']);
    titleName.innerHTML = name;
    titleItem.append(titleName);
    if (value1) {
      let titleValue1: HTMLDivElement = Div.build(['metrage-input_item-value1']);
      titleValue1.innerHTML = value1.toString();
      titleItem.append(titleValue1);
    }
    if (value2) {
      let titleValue2: HTMLDivElement = Div.build(['metrage-input_item-value2']);
      titleValue2.innerHTML = value2.toString();
      titleItem.append(titleValue2);
    }
    if (tooltip) {
      titleItem.append(TooltipIcon(tooltip));
    }
    return titleItem;
  }
}

export class MetrageOutputItem {
  static build(name: string, value1: string | null = null, value2: string | null = null): HTMLDivElement {
    let titleItem: HTMLDivElement = Div.build(['metrage-output_item']);
    let titleName: HTMLDivElement = Div.build(['metrage-output_item-name']);
    titleName.innerHTML = name;
    titleItem.append(titleName);
    if (value1) {
      let titleValue1: HTMLDivElement = Div.build(['metrage-output_item-value1']);
      titleValue1.innerHTML = value1;
      titleItem.append(titleValue1);
    }
    if (value2) {
      let titleValue2: HTMLDivElement = Div.build(['metrage-output_item-value2']);
      titleValue2.innerHTML = value2;
      titleItem.append(titleValue2);
    }
    return titleItem;
  }
}

export class Divider {
  static build(): HTMLDivElement {
    let wrap: HTMLDivElement = Div.build(['metrage-output_divider-wrap']);
    wrap.append(Div.build(['metrage-output_divider']));
    return wrap;
  }
}

export class InputFormField {
  id: string;
  name: string;
  input: HTMLInputElement;
  classList: string[];

  constructor(classList: string[] | null = null, placeholder: string | null = null) {
    this.classList = classList ? classList : new Array('');
    this.id = createId('input-formfield');
    this.name = createId('input-name');
    this.input = Input.build('text', ['form-input', 'w-input'], {
      'maxlength': 256,
      'name': this.name,
      'id': this.id,
      'placeholder': placeholder ?? ''
    });
  }

  addEventListener<K extends keyof HTMLElementEventMap>(type: string, listener: any, options?: boolean | AddEventListenerOptions): void {
    this.input.addEventListener(type, listener, options);
  }

  get value(): any {
    return this.input.value;
  }

  build(title: string, tooltip: string | null = null): HTMLDivElement {
    const inputGroup: HTMLDivElement = Div.build(['form-field']);
    this.classList.forEach(function (c: string): void {
      if (c)
        inputGroup.classList.add(c);
    });

    const formLabelWrapper: HTMLDivElement = Div.build(['form-label-wrapper']);
    inputGroup.append(formLabelWrapper);
    const label: HTMLLabelElement = Label.build(['form-label'], {'for': this.id});
    label.innerText = title;
    formLabelWrapper.append(label);

    if (tooltip)
      formLabelWrapper.append(TooltipIcon(tooltip));

    inputGroup.append(this.input);

    return inputGroup;
  }
}