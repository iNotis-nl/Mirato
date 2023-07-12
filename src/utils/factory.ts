/**
 * Factory to create elements in the Form window
 */
import {Div, Img, Input, Label} from "$utils/html";

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

  build(): HTMLDivElement {
    const titleDiv: HTMLDivElement = Div.build(['tool-m2_outcome-item', this.style === 'muted' ? 'text-style-muted' : '']);
    const metrageItem: HTMLElement = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageItem.classList.add('tool-m2_outcome-title-label');
    if (this.style === 'header') {
      metrageItem.classList.add('is-metrage');
    }
    this.classes.forEach((c: string) => {
      metrageItem.classList.add(c);
    });
    metrageItem.innerHTML = this.title;
    titleDiv.append(metrageItem);

    const metrageQtyOut: HTMLElement = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageQtyOut.classList.add('tool-m2_outcome-item-data');
    metrageQtyOut.innerHTML = String(this.qty);
    titleDiv.append(metrageQtyOut);

    const metrageM2Out: HTMLElement = document.createElement(this.style === 'header' ? 'H3' : this.style === 'subheader' ? 'H4' : 'div');
    metrageM2Out.classList.add('tool-m2_outcome-item-data');
    metrageM2Out.innerHTML = String(this.m2);
    titleDiv.append(metrageM2Out);

    return titleDiv;
  }
}

export class MetrageStack {
  stack: Array<MetrageItemRow>;

  constructor(...args: Array<MetrageItemRow | null>) {
    // @ts-ignore
    this.stack = args.filter(value => value !== null);
  }

  build(): HTMLDivElement {
    const stackDiv: HTMLDivElement = Div.build(['stack']);
    this.stack.forEach(function (itemRow: MetrageItemRow): void {
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
  dropDownBody: HTMLDivElement;
  dropDownTitleDiv: HTMLDivElement;

  constructor() {
    this.id = window.Form?.createId('dropdown');
    this.dropDownBody = Div.build(['tool-m2-department']);
    this.dropDownTitleDiv = Div.build(['fs_accordion-2_label']);
  }

  append(item: HTMLElement): void {
    this.dropDownBody.append(item);
  }

  build(): HTMLDivElement {
    // DropDown
    const dropDown: HTMLDivElement = Div.build(['fs_accordion-2_item'], {'fs-accordion-element': 'accordion'});

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

export class InputFormField {
  id: string;
  name: string;
  input: HTMLInputElement;
  classList:string[];

  constructor( classList:string[]|null = null ) {
    this.classList = classList ? classList : new Array('');
    this.id = window.Form?.createId('input-formfield');
    this.name = window.Form?.createId('input-name');
    this.input = Input.build('text', ['form-input', 'w-input'], {'maxlength': 256, 'name': this.name, 'id': this.id});
  }

  addEventListener<K extends keyof HTMLElementEventMap>(type: string, listener: any, options?: boolean | AddEventListenerOptions): void {
    this.input.addEventListener(type, listener, options);
  }

  build(title: string, tooltip: string | null = null): HTMLDivElement {
    const formField: HTMLDivElement = Div.build(['form-field']);
    this.classList.forEach(function (c: string): void {
      if (c)
        formField.classList.add(c);
    });

    const formLabelWrapper: HTMLDivElement = Div.build(['form-label-wrapper']);
    formField.append(formLabelWrapper);
    const label: HTMLLabelElement = Label.build(['form-label'], {'for': this.id});
    label.innerText = title;
    formLabelWrapper.append(label);

    if (tooltip) {
      const src: string = 'https://uploads-ssl.webflow.com/62691a9a7781f77d01732f92/6409d1826dd2b4aec44b4b00_info_FILL0_wght500_GRAD-25_opsz20.svg';
      const infoImg: HTMLImageElement = Img.build(src, ['tooltip-icon'], {
        'loading': 'lazy',
        'alt': '',
        'title': tooltip
      });
      formLabelWrapper.append(infoImg);

      // TODO: This doesn't work!
      const tooltipWrapper: HTMLDivElement = Div.build(['tooltip-wrapper'], {
        'style': 'display: none; opacity: 0; transform: translate3d(0px, 0.5rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;'
      });
      formLabelWrapper.append(tooltipWrapper);
      const tooltipText: HTMLDivElement = Div.build(['tooltip-text']);
      tooltipWrapper.append(tooltipText);
      tooltipText.innerHTML = tooltip;

    }
    formField.append(this.input);

    return formField;
  }
}