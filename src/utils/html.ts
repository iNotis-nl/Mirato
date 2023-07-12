export class Div {
  static build(classList: Array<string> | null = null, attributes: Object | null = null): HTMLDivElement {
    return Element.build('div', classList, attributes) as HTMLDivElement;
  }
}

export class Anchor {
  static build(classList: Array<string> | null = null, attributes: Object | null = null): HTMLAnchorElement {
    return Element.build('a', classList, attributes) as HTMLAnchorElement;
  }
}

export class Label {
  static build(classList: Array<string> | null = null, attributes: Object | null = null): HTMLLabelElement {
    return Element.build('label', classList, attributes) as HTMLLabelElement;
  }
}

export class Span {
  static build(classList: Array<string> | null = null, attributes: Object | null = null): HTMLSpanElement {
    return Element.build('span', classList, attributes) as HTMLSpanElement;
  }
}

export class Input {
  static build(type: string, classList: Array<string> | null = null, attributes: Object | null = null): HTMLInputElement {
    attributes = attributes ? attributes : new Object({});
    attributes = Object.assign(attributes, {'type': type});
    return Element.build('input', classList, attributes) as HTMLInputElement;
  }
}

export class Img {
  static build(src: string, classList: Array<string> | null = null, attributes: Object | null = null): HTMLImageElement {
    attributes = attributes ? attributes : new Object({});
    attributes = Object.assign(attributes, {'src': src});
    return Element.build('img', classList, attributes) as HTMLImageElement;
  }
}

export class Element {
  static build(tagName: string, classList: Array<string> | null = null, attributes: Object | null = null): HTMLElement {
    const e: HTMLElement = document.createElement(tagName) as HTMLElement;
    classList = classList ? classList : new Array('');
    attributes = attributes ? attributes : new Object({});
    classList.forEach(function (c: string): void {
      if (c)
        e.classList.add(c);
    });
    Object.keys(attributes).forEach(function (n: string): void {
      // @ts-ignore
      e.setAttribute(n, attributes[n]);
    })
    return e;
  }
}

export class CheckboxLabel {
  static build(text: string, value: string, selected: boolean = false, classList: Array<string> | null = null, readonly: boolean = false): HTMLLabelElement {
    const id = window.Form?.createId('CheckboxLabel');
    const label: HTMLLabelElement = Label.build(['w-checkbox', 'form-checkbox']);
    classList = classList ? classList : new Array('');
    classList.forEach(function (c: string): void {
      if (c)
        label.classList.add(c);
    });
    const icon: HTMLDivElement = Div.build(['w-checkbox-input', 'w-checkbox-input--inputType-custom', 'form-checkbox-icon', readonly ? 'w-input-disabled' : '']);
    const checkbox: HTMLInputElement = Input.build('checkbox', null, {
      'id': id,
      'style': 'opacity:0;position:absolute;z-index:-1',
      'value': value,
    });
    if (readonly) {
      checkbox.readOnly = true;
      checkbox.disabled = true;
    }
    if (selected) {
      icon.classList.add('w--redirected-checked');
      checkbox.setAttribute('checked', 'true');
    }
    const span: HTMLSpanElement = Span.build(['form-checkbox-label', 'w-form-label'], {'for': id});
    span.innerHTML = text;

    label.append(icon);
    label.append(checkbox);
    label.append(span);

    return label;
  }
}