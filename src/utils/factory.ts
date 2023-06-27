/**
 * Factory to create elements in the Form window
 */
import {Div} from "$utils/html";

export class MetrageItemRow {
  title: string;
  qty: number | string | null;
  m2: number | string | null | undefined;
  style: string;
  classes: string[];

  constructor(title: string, qty: number | string | null, m2: number | string | null | undefined, style: string = 'default', classes: string[] = []) {
    this.title = title;
    this.qty = qty;
    this.m2 = m2;
    this.style = style;
    this.classes = classes;
  }

  build() {
    const titleDiv = Div.build(['tool-m2_outcome-item', this.style === 'muted' ? 'text-style-muted' : '']);
    const metrageItem = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageItem.classList.add('tool-m2_outcome-title-label');
    this.classes.forEach((c: string) => {
      metrageItem.classList.add(c);
    });
    metrageItem.innerHTML = this.title;
    titleDiv.append(metrageItem);

    const metrageQtyOut = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageQtyOut.classList.add('tool-m2_outcome-item-data');
    metrageQtyOut.innerHTML = String(this.qty);
    titleDiv.append(metrageQtyOut);

    const metrageM2Out = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageM2Out.classList.add('tool-m2_outcome-item-data');
    metrageM2Out.innerHTML = String(this.m2);
    titleDiv.append(metrageM2Out);

    return titleDiv;
  }
}

export class MetrageStack {
  stack: Array<MetrageItemRow>;

  constructor(...args: Array<MetrageItemRow>) {
    this.stack = args;
  }

  build(): HTMLDivElement {
    const stackDiv: HTMLDivElement = Div.build(['stack']);
    this.stack.forEach(function (itemRow: MetrageItemRow) {
      stackDiv.append(itemRow.build());
    });
    return stackDiv;
  }

  append(itemRow: MetrageItemRow): void {
    this.stack.push(itemRow);
  }
}

export class DropDownGroup {
  dropDownGroupBody: HTMLDivElement;
  initial: number = -1;

  constructor() {
    this.dropDownGroupBody = Div.build(['fs_accordion-2_component'], {
      'fs-accordion-single': true,
      'fs-accordion-element': 'group',
      'fs-accordion-initial': this.initial
    });
  }

  build() {
    return this.dropDownGroupBody;
  }

  append(htmlDivElement: HTMLDivElement) {
    this.initial++;
    this.dropDownGroupBody.setAttribute('fs-accordion-initial', this.initial.toString());
    this.dropDownGroupBody.append(htmlDivElement);
  }
}

export class DropDown {
  id: string;
  dropDownBody: HTMLDivElement;
  dropDownTitleDiv: HTMLDivElement;

  constructor() {
    this.id = window.Form?.createId('dropdown');
    this.dropDownBody = Div.build(['tool-m2-department']);
    this.dropDownTitleDiv = Div.build(['fs_accordion-2_label']);
  }

  append(item: HTMLElement) {
    this.dropDownBody.append(item);
  }

  build() {
    // DropDown
    const dropDown = Div.build(['fs_accordion-2_item'], {'fs-accordion-element': 'accordion'});

    // Header/Name
    const dropDownTitle = Div.build(['fs_accordion-2_header'], {
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

    const dropDownArrow = Div.build(['fs_accordion-2_arrow-wrapper'], {'fs-accordion-element': 'arrow'});
    dropDownTitle.append(dropDownArrow);

    const dropDownArrowIcon = Div.build(['fs_accordion-2_icon', 'w-icon-dropdown-toggle']);
    dropDownArrow.append(dropDownArrowIcon);

    // Content Box
    const dropdownContent = Div.build(['fs_accordion-2_content'], {
      'id': this.id + '-content',
      'aria-labelledby': this.id + '-header',
      'fs-accordion-element': 'content'
    });
    dropdownContent.style.maxHeight = '0px';
    dropdownContent.style.display = 'none';
    dropDown.append(dropdownContent);

    const dropdownBodyContainer = Div.build([('fs_accordion-2_body')]);
    dropdownContent.append(dropdownBodyContainer);
    dropdownBodyContainer.append(this.dropDownBody);

    return dropDown;
  }

  setName(name: string) {
    this.dropDownTitleDiv.textContent = name;
  }
}

export class InputFormField {
  id: string;
  name: string;
  input: HTMLInputElement;

  constructor() {
    this.id = window.Form?.createId('input-formfield');
    this.name = window.Form?.createId('input-name');
    this.input = document.createElement('input') as HTMLInputElement;
  }

  addEventListener<K extends keyof HTMLElementEventMap>(type: string, listener: any, options?: boolean | AddEventListenerOptions): void {
    this.input.addEventListener(type, listener, options);
  }

  build(title: string, tooltip: string | null = null) {
    const formField = Div.build(['form-field']);
    const formLabelWrapper = Div.build(['form-label-wrapper']);
    formField.append(formLabelWrapper);
    const label = document.createElement('label');
    label.setAttribute('for', this.id);
    label.classList.add('form-label');
    label.innerText = title;
    formLabelWrapper.append(label);

    if (tooltip) {
      const infoImg = document.createElement('img');
      infoImg.setAttribute('loading', 'lazy');
      infoImg.setAttribute('src', 'https://uploads-ssl.webflow.com/62691a9a7781f77d01732f92/6409d1826dd2b4aec44b4b00_info_FILL0_wght500_GRAD-25_opsz20.svg');
      infoImg.setAttribute('alt', '');
      infoImg.setAttribute('title', tooltip);
      infoImg.classList.add('tooltip-icon');
      formLabelWrapper.append(infoImg);

      // TODO: This doesn't work!
      const tooltipWrapper = Div.build(['tooltip-wrapper'], {
        'style': 'display: none; opacity: 0; transform: translate3d(0px, 0.5rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;'
      });
      formLabelWrapper.append(tooltipWrapper);
      const tooltipText = Div.build(['tooltip-text']);
      tooltipWrapper.append(tooltipText);
      tooltipText.innerHTML = tooltip;

    }
    this.input.setAttribute('type', 'text');
    this.input.classList.add('form-input', 'w-input');
    this.input.setAttribute('maxlength', '256');
    this.input.setAttribute('name', this.name);
    this.input.setAttribute('id', this.id);
    formField.append(this.input);

    return formField;
  }
}